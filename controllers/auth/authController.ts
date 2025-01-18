import { Request, Response, NextFunction } from "express";
import User from "../../models/userModel";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { authenticateUser, validateToken } from "../../utils/token";
import { sendMail } from "../../utils/Emails";
import { createHash } from "crypto";
import { filterObject } from "../../utils/objects";
import { ProtectedRequest } from "./types";

/**
 * Register new user
 */

export const signup = catchAsync(async (req: Request, res: Response) => {
  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const user = await User.create(userData);
  authenticateUser(user, 201, res);
});

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Case 1 : No Email or Password
    if (!email || !password)
      return next(new AppError("Please enter email and Password", 400));
    const user = await User.findOne({ email }).select("+password");
    // Case 2 : No User found with these credentials
    if (!user) return next(new AppError("Wrong Credentials", 401));
    // Case 3 : Wrong password
    const authenticated = await (user as any).checkPassword(
      password,
      user?.password
    );
    if (!authenticated) return next(new AppError("Wrong Credentials", 401));
    // Case 4 : Correct credentials
    authenticateUser(user, 200, res);
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check that the user exists
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User doesn't exist", 404));
    // 2. Generate the user new token
    const resetToken = (user as any).generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3. Send User an Email with the new token
    const tokenURL = `${req.protocol}://${req.hostname}/api/v${process.env.API_VERSION}/users/resetPassword/${resetToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Natours: Forgot your password?",
        message: `We have recived your request regarding forgetting your password (In case you didn't request a password reset please ignore this message). Please Follow the following link to reset your new password. 
        Reset link : ${tokenURL}`,
      });
      res.status(200).json({
        status: "success",
        message: "Reset Link Was sent to your email successfully",
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiration = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError(err?.message, 500));
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1.Get the user based on the token
    const requestToken = req?.params?.token;
    const password = req?.body?.password;
    const passwordConfirm = req?.body?.passwordConfirm;
    if (!requestToken)
      return next(new AppError("Please send the password reset token", 400));
    if (!password || !passwordConfirm)
      return next(new AppError("Please send the password", 400));
    const hashedToken = createHash("sha256").update(requestToken).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiration: { $gt: new Date() },
    });
    // 2.If the token hasn't expired yet set the new password
    if (!user) return next(new AppError("Invalid User or Token Expired", 400));
    user.password = password;
    user.confirmPassword = passwordConfirm;
    user.resetPasswordExpiration = undefined;
    user.resetPasswordToken = undefined;
    // 3.Set the passwordChangedAt to now
    user.changePasswordAt = new Date();
    await user.save();

    // 4.Login the user and send JWT
    authenticateUser(user, 200, res);
  }
);

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req?.body?.oldPassword;
    const newPassword = req?.body?.newPassword;
    const confirmPassword = req?.body?.confirmPassword;
    if (!oldPassword || !newPassword || !confirmPassword)
      return next(
        new AppError(
          "Please Enter the oldPassword, newPassword and confirmPassword.",
          400
        )
      );
    const currentUser = await User.findById((req as any)?.user?.id).select(
      "+password"
    );
    const isPasswordCorrect = (currentUser as any)?.checkPassword(
      oldPassword,
      currentUser?.password
    );
    if (!isPasswordCorrect)
      return next(new AppError("Please provide a correct user password", 400));
    currentUser.password = newPassword;
    currentUser.confirmPassword = confirmPassword;
    await currentUser?.save();
    authenticateUser(currentUser, 200, res);
  }
);

export const deleteCurrentUser = catchAsync(
  async (req: ProtectedRequest, res: Response) => {
    await User.findByIdAndUpdate(
      req?.user?.id,
      { isDeleted: true },
      { runValidators: true }
    );
    res?.status(204).json({
      status: "success",
    });
  }
);

export const updateCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.password || req?.body?.confirmPassword)
      return next(
        new AppError(
          "This Endpoint isn't used for updating password, please use /changePassword",
          400
        )
      );
    const updatedData = filterObject(req?.body, "name", "email", "photo");
    const user = await User.findByIdAndUpdate(
      (req as any)?.user?.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    res?.status(200).json({
      status: "success",
      user,
    });
  }
);

export const protectRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get the token and check if it exists
    const token = req?.headers?.authorization?.split(" ")?.[1];
    if (!token) return next(new AppError("User is not logged in.", 401));
    // 2. Check the token is valid
    const decodedToken = await validateToken(token);
    // 3. Check if the user still exists
    const requestOwner = await User.findById(decodedToken?.id);
    if (!requestOwner) return next(new AppError("User No Longer exists", 401));
    // 4. Check if the user haven't changed password after getting the token
    if ((requestOwner as any).changePasswordAfter(decodedToken?.iat))
      return next(
        new AppError("User Changed Password Please sign in again", 401)
      );
    // 5. Attach user data to the request
    (req as any).user = requestOwner;

    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role))
      return next(
        new AppError("You don't have the permission to take this action", 403)
      );
    next();
  };

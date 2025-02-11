import { NextFunction, Request, Response } from "express";
import User, { userSchema } from "../../models/userModel";
import EntityHandler from "../entityHandler";
import { catchAsync } from "../../utils/catchAsync";
import { ProtectedRequest } from "../auth/types";
import multer from "multer";
import AppError from "../../utils/AppError";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req: ProtectedRequest, file, cb) => {
    const ext = file?.mimetype?.split("/")[1];
    cb(null, `user-${req?.user?.id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file?.mimetype?.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Only Images are Allowed", 400));
    }
  },
});

export const uploadUserFormData = upload.single("photo");

const userHandler = new EntityHandler(User);

// export const getAllUsers = catchAsync(async function (
//   req: Request,
//   res: Response
// ) {
//   const queryStrings = req?.query;
//   const queryObj = { ...queryStrings };
//   const usersQuery = new QueryAPI(queryObj, userSchema, User)
//     .filter()
//     .sort()
//     .select()
//     .paginate().query;
//   const users = await usersQuery;

//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

export function createUser(req: Request, res: Response) {
  res.status(500).json({
    status: "fail",
    message: "This route isnt defined please use /signup",
  });
}

export const getCurrentUser = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
  }
);

export const getAllUsers = userHandler.getAll(userSchema);
export const getUser = userHandler.getOne();
export const deleteUser = userHandler.deleteOne(); // DON'T Use This Route to Update Password
export const updateUser = userHandler.updateOne();

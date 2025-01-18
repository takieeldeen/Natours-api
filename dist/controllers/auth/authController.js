"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protectRoute = exports.updateCurrentUser = exports.deleteCurrentUser = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.signin = exports.signup = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const token_1 = require("../../utils/token");
const Emails_1 = require("../../utils/Emails");
const crypto_1 = require("crypto");
const objects_1 = require("../../utils/objects");
/**
 * Register new user
 */
exports.signup = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    const user = yield userModel_1.default.create(userData);
    (0, token_1.authenticateUser)(user, 201, res);
}));
exports.signin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Case 1 : No Email or Password
    if (!email || !password)
        return next(new AppError_1.default("Please enter email and Password", 400));
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    // Case 2 : No User found with these credentials
    if (!user)
        return next(new AppError_1.default("Wrong Credentials", 401));
    // Case 3 : Wrong password
    const authenticated = yield user.checkPassword(password, user === null || user === void 0 ? void 0 : user.password);
    if (!authenticated)
        return next(new AppError_1.default("Wrong Credentials", 401));
    // Case 4 : Correct credentials
    (0, token_1.authenticateUser)(user, 200, res);
}));
exports.forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check that the user exists
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        return next(new AppError_1.default("User doesn't exist", 404));
    // 2. Generate the user new token
    const resetToken = user.generatePasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3. Send User an Email with the new token
    const tokenURL = `${req.protocol}://${req.hostname}/api/v${process.env.API_VERSION}/users/resetPassword/${resetToken}`;
    try {
        yield (0, Emails_1.sendMail)({
            email: user.email,
            subject: "Natours: Forgot your password?",
            message: `We have recived your request regarding forgetting your password (In case you didn't request a password reset please ignore this message). Please Follow the following link to reset your new password. 
        Reset link : ${tokenURL}`,
        });
        res.status(200).json({
            status: "success",
            message: "Reset Link Was sent to your email successfully",
        });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.default(err === null || err === void 0 ? void 0 : err.message, 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // 1.Get the user based on the token
    const requestToken = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.token;
    const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password;
    const passwordConfirm = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.passwordConfirm;
    if (!requestToken)
        return next(new AppError_1.default("Please send the password reset token", 400));
    if (!password || !passwordConfirm)
        return next(new AppError_1.default("Please send the password", 400));
    const hashedToken = (0, crypto_1.createHash)("sha256").update(requestToken).digest("hex");
    const user = yield userModel_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiration: { $gt: new Date() },
    });
    // 2.If the token hasn't expired yet set the new password
    if (!user)
        return next(new AppError_1.default("Invalid User or Token Expired", 400));
    user.password = password;
    user.confirmPassword = passwordConfirm;
    user.resetPasswordExpiration = undefined;
    user.resetPasswordToken = undefined;
    // 3.Set the passwordChangedAt to now
    user.changePasswordAt = new Date();
    yield user.save();
    // 4.Login the user and send JWT
    (0, token_1.authenticateUser)(user, 200, res);
}));
exports.changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const oldPassword = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.oldPassword;
    const newPassword = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.newPassword;
    const confirmPassword = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.confirmPassword;
    if (!oldPassword || !newPassword || !confirmPassword)
        return next(new AppError_1.default("Please Enter the oldPassword, newPassword and confirmPassword.", 400));
    const currentUser = yield userModel_1.default.findById((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.id).select("+password");
    const isPasswordCorrect = currentUser === null || currentUser === void 0 ? void 0 : currentUser.checkPassword(oldPassword, currentUser === null || currentUser === void 0 ? void 0 : currentUser.password);
    if (!isPasswordCorrect)
        return next(new AppError_1.default("Please provide a correct user password", 400));
    currentUser.password = newPassword;
    currentUser.confirmPassword = confirmPassword;
    yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.save());
    (0, token_1.authenticateUser)(currentUser, 200, res);
}));
exports.deleteCurrentUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield userModel_1.default.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, { isDeleted: true }, { runValidators: true });
    res === null || res === void 0 ? void 0 : res.status(204).json({
        status: "success",
    });
}));
exports.updateCurrentUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.password) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.confirmPassword))
        return next(new AppError_1.default("This Endpoint isn't used for updating password, please use /changePassword", 400));
    const updatedData = (0, objects_1.filterObject)(req === null || req === void 0 ? void 0 : req.body, "name", "email", "photo");
    const user = yield userModel_1.default.findByIdAndUpdate((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id, updatedData, {
        new: true,
        runValidators: true,
    });
    res === null || res === void 0 ? void 0 : res.status(200).json({
        status: "success",
        user,
    });
}));
exports.protectRoute = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // 1. Get the token and check if it exists
    const token = (_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")) === null || _c === void 0 ? void 0 : _c[1];
    if (!token)
        return next(new AppError_1.default("User is not logged in.", 401));
    // 2. Check the token is valid
    const decodedToken = yield (0, token_1.validateToken)(token);
    // 3. Check if the user still exists
    const requestOwner = yield userModel_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
    if (!requestOwner)
        return next(new AppError_1.default("User No Longer exists", 401));
    // 4. Check if the user haven't changed password after getting the token
    if (requestOwner.changePasswordAfter(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.iat))
        return next(new AppError_1.default("User Changed Password Please sign in again", 401));
    // 5. Attach user data to the request
    req.user = requestOwner;
    next();
}));
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
        return next(new AppError_1.default("You don't have the permission to take this action", 403));
    next();
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=authController.js.map
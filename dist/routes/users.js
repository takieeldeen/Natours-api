"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../controllers/auth");
const userRouter = express_1.default.Router();
console.log("test");
// UnProtected Authentication Routes ////////////////////////////
userRouter.post("/signup", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.signup);
userRouter.post("/signin", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.signin);
userRouter.post("/signout", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.logout);
// userRouter.post("/okta-signin", authController?.oktaSignIn);
userRouter.patch("/forgetPassword", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.forgotPassword);
userRouter.patch("/resetPassword/:token", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.resetPassword);
// Protected Authentication Routes ////////////////////////////
userRouter.use(auth_1.authController.protectRoute);
userRouter.get("/profile", users_1.userController.getCurrentUser, users_1.userController.getUser);
userRouter.patch("/changePassword", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.changePassword);
userRouter.patch("/updateCurrentUser", users_1.userController.uploadUserFormData, auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.updateCurrentUser);
userRouter.delete("/deleteCurrentUser", auth_1.authController === null || auth_1.authController === void 0 ? void 0 : auth_1.authController.deleteCurrentUser);
userRouter.use(auth_1.authController.restrictTo("admin"));
userRouter
    .route("/:id")
    .get(users_1.userController.getUser)
    .patch(users_1.userController.updateUser)
    .delete(users_1.userController.deleteUser);
userRouter
    .route("/")
    .get(users_1.userController.getAllUsers)
    .post(users_1.userController.createUser);
exports.default = userRouter;
//# sourceMappingURL=users.js.map
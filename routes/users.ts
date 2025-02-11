import express from "express";
import { userController } from "../controllers/users";
import { authController } from "../controllers/auth";
const userRouter = express.Router();
console.log("test");
// UnProtected Authentication Routes ////////////////////////////
userRouter.post("/signup", authController?.signup);
userRouter.post("/signin", authController?.signin);
userRouter.post("/signout", authController?.logout);
// userRouter.post("/okta-signin", authController?.oktaSignIn);
userRouter.patch("/forgetPassword", authController?.forgotPassword);
userRouter.patch("/resetPassword/:token", authController?.resetPassword);
// Protected Authentication Routes ////////////////////////////
userRouter.use(authController.protectRoute);
userRouter.get(
  "/profile",
  userController.getCurrentUser,
  userController.getUser
);
userRouter.patch("/changePassword", authController?.changePassword);
userRouter.patch(
  "/updateCurrentUser",
  userController.uploadUserFormData,
  authController?.updateCurrentUser
);
userRouter.delete("/deleteCurrentUser", authController?.deleteCurrentUser);

userRouter.use(authController.restrictTo("admin"));

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default userRouter;

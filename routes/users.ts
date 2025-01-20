import express from "express";
import { userController } from "../controllers/users";
import { authController } from "../controllers/auth";
const userRouter = express.Router();

// UnProtected Authentication Routes ////////////////////////////
userRouter.post("/signup", authController?.signup);
userRouter.post("/signin", authController?.signin);
// userRouter.post("/okta-signin", authController?.oktaSignIn);
userRouter.patch("/forgetPassword", authController?.forgotPassword);
userRouter.patch("/resetPassword/:token", authController?.resetPassword);
// Protected Authentication Routes ////////////////////////////
userRouter.patch(
  "/changePassword",
  authController?.protectRoute,
  authController?.changePassword
);
userRouter.patch(
  "/updateCurrentUser",
  authController?.protectRoute,
  authController?.updateCurrentUser
);
userRouter.delete(
  "/deleteCurrentUser",
  authController?.protectRoute,
  authController?.deleteCurrentUser
);

userRouter
  .route("/")
  .get(authController.protectRoute, userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.useGetUser)
  .patch(userController.updateUser)
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

export default userRouter;

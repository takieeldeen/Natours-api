import express from 'express';
import { userController } from '../controllers/users';
const userRouter = express.Router();

userRouter
  .route('/')
  .get(userController.useGetUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.useGetUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const userRouter = express_1.default.Router();
userRouter
    .route('/')
    .get(users_1.userController.useGetUsers)
    .post(users_1.userController.createUser);
userRouter
    .route('/:id')
    .get(users_1.userController.useGetUser)
    .patch(users_1.userController.updateUser)
    .delete(users_1.userController.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=users.js.map
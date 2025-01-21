"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateUser = exports.deleteUser = exports.getUser = exports.getAllUsers = exports.getCurrentUser = void 0;
exports.createUser = createUser;
const userModel_1 = __importStar(require("../../models/userModel"));
const entityHandler_1 = __importDefault(require("../entityHandler"));
const catchAsync_1 = require("../../utils/catchAsync");
const userHandler = new entityHandler_1.default(userModel_1.default);
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
function createUser(req, res) {
    res.status(500).json({
        status: "fail",
        message: "This route isnt defined please use /signup",
    });
}
exports.getCurrentUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.params.id = req.user.id;
    next();
}));
exports.getAllUsers = userHandler.getAll(userModel_1.userSchema);
exports.getUser = userHandler.getOne();
exports.deleteUser = userHandler.deleteOne(); // DON'T Use This Route to Update Password
exports.updateUser = userHandler.updateOne();
//# sourceMappingURL=userController.js.map
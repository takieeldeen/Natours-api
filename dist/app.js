"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
// import { userRouter } from "./routes";
console.log("Started");
const app = (0, express_1.default)();
console.log("Express started");
// Third Party Middlewares
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
console.log(`Current environment is ${process.env.NODE_ENV}`);
app.use(express_1.default.json());
// Mounting Routers
app.use("/api/v1/tours", routes_1.tourRouter);
console.log("tourRouter is mounted successfully");
// app.use("/api/v1/users", userRouter);
console.log("userRouter is mounted successfully");
// Users Routes
exports.default = app;
//# sourceMappingURL=app.js.map
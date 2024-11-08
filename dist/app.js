"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const routes_2 = require("./routes");
const app = (0, express_1.default)();
const ;
// Third Party Middlewares
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Mounting Routers
app.use("/api/v1/tours", routes_1.tourRouter);
app.use("/api/v1/users", routes_2.userRouter);
// Users Routes
exports.default = app;
//# sourceMappingURL=app.js.map
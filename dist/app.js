"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const tours_1 = __importDefault(require("./routes/tours"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// Third Party Middlewares
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Mounting Routers
app.use("/api/v1/tours", tours_1.default);
app.use("/api/v1/users", users_1.default);
// Users Routes
exports.default = app;
//# sourceMappingURL=app.js.map
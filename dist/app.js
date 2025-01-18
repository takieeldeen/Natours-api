"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const tours_1 = __importDefault(require("./routes/tours"));
const users_1 = __importDefault(require("./routes/users"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Third Party Middlewares
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Maximum Requests reached please try again in an hour",
});
app.use("/api", limiter);
app.use((0, cookie_parser_1.default)());
// Security Headers
app.use((0, hpp_1.default)({
    whitelist: [
        "price",
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price",
    ],
}));
app.use((0, helmet_1.default)());
// Body parser
app.use(express_1.default.json({ limit: "10kb" }));
// Sanitizer For Non Query Injection
app.use((0, express_mongo_sanitize_1.default)());
// Mounting Routers
app.use("/api/v1/tours", tours_1.default);
app.use("/api/v1/users", users_1.default);
app.use("/api/v1/reviews", routes_1.reviewRouter);
app.use("*", (req, res, next) => {
    const error = new AppError_1.default(`Couldn't find any handler for route ${req.originalUrl}`, 404);
    next(error);
});
app.use(errorController_1.default);
// Users Routes
exports.default = app;
//# sourceMappingURL=app.js.map
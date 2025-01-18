import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import tourRouter from "./routes/tours";
import userRouter from "./routes/users";
import AppError from "./utils/AppError";
import errorController from "./controllers/errorController";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import { reviewRouter } from "./routes";
const app = express();
// Third Party Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Maximum Requests reached please try again in an hour",
});
app.use("/api", limiter);
app.use(cookieParser());
// Security Headers
app.use(
  hpp({
    whitelist: [
      "price",
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(helmet());
// Body parser
app.use(express.json({ limit: "10kb" }));
// Sanitizer For Non Query Injection
app.use(mongoSanitize());
// Mounting Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("*", (req, res, next) => {
  const error = new AppError(
    `Couldn't find any handler for route ${req.originalUrl}`,
    404
  );
  next(error);
});

app.use(errorController);
// Users Routes
export default app;

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
import path from "path";
import viewsRouter from "./routes/views";
const app = express();

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);
// Server Side Rendering
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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
app.use(helmet({ contentSecurityPolicy: false }));

// Sanitizer For Non Query Injection
app.use(mongoSanitize());

// Mounting API Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
// Mounting Website Routes
app.use("/", viewsRouter);
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

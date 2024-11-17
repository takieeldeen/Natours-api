import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tours";
import userRouter from "./routes/users";
const app = express();
// Third Party Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
// Mounting Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
// Users Routes
export default app;

import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const handleDatabaseCastError = (error: AppError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = `invalid ${(error as any)?.path}:${(error as any)?.value} `;
  return new AppError(message, 400);
};

const generateProductionError = (error: AppError, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // We want to know about the error in our server logs
    console.error(error);
    // We don't want to leak our Functional Error to the client
    res.status(500).json({
      status: "error",
      message: "Someting Went wrong",
    });
  }
};

const generateDevelopmentError = (error: AppError, res: Response) => {
  res.status(error.statusCode).json({
    isOperational: error.isOperational,
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

export default (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";
  error.isOperational = error.isOperational ?? false;
  if (process.env.NODE_ENV === "development") {
    generateDevelopmentError(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let modifiedError = { ...error };
    if (error?.name === "castError") {
      modifiedError = handleDatabaseCastError(error);
    }
    generateProductionError(modifiedError, res);
  }
  next();
};

import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { MongoServerError } from "mongodb";
import { Error } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const handleDatabaseCastError = (error: Error.CastError) => {
  const message = `invalid ${error?.path}:${error?.value} `;
  return new AppError(message, 400);
};

const handleDatabaseDuplicateKeyError = (err: MongoServerError) => {
  const duplicateFieldName = Object.keys(err?.errorResponse?.keyValue)?.[0];
  const duplicateFieldValue =
    err?.errorResponse?.keyValue?.[duplicateFieldName];

  const message = `A tour with ${duplicateFieldName} of ${duplicateFieldValue} already exists`;
  return new AppError(message, 400);
};

const handleDatabaseValidationError = (err: Error.ValidationError) => {
  const message = Object.values(err?.errors)
    .map((error) => error?.message)
    ?.join(", ");

  return new AppError(message, 400);
};

const handleJasonWebTokenError = (
  err: JsonWebTokenError | TokenExpiredError
) => {
  let message: string;
  if (err?.name === "TokenExpiredError") {
    message = "Expired Token, Please Login again";
  }
  if (err?.name === "JsonWebTokenError") {
    message = "Invalid Token, Please Login again";
  }
  return new AppError(message, 401);
};

const generateProductionError = (
  error: AppError,
  req: Request,
  res: Response
) => {
  const apiRequest = req.originalUrl.startsWith("/api");
  if (error.isOperational && apiRequest) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else if (apiRequest && !error.isOperational) {
    // We don't want to leak our Functional Error to the client
    res.status(500).json({
      status: "error",
      message: "Someting Went wrong",
    });
  }
  res.status(error.isOperational ? error.statusCode : 500).render("error", {
    status: error.isOperational ? error.status : "error",
    message: error.isOperational ? error.message : "Something Went Wrong!",
  });
};

const generateDevelopmentError = (
  error: AppError,
  req: Request,
  res: Response
) => {
  const apiRequest = req?.originalUrl?.startsWith("/api");
  if (apiRequest)
    res.status(error.statusCode).json({
      isOperational: error.isOperational,
      status: error.status,
      message: error.message,
      stack: error.stack,
      error,
    });
  res.status(error.statusCode).render("error", {
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
    generateDevelopmentError(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = Object.create(Object.getPrototypeOf(error));
    Object.assign(err, error);
    err.message = error.message;
    // Cast Error Handling ////////////////////////
    if (err?.name === "CastError") err = handleDatabaseCastError(err);
    // Unique Constraint Error ////////////////////
    if (err?.code === 11000) err = handleDatabaseDuplicateKeyError(err);
    // Validation Error Handling //////////////////
    if (err?.name === "ValidationError")
      err = handleDatabaseValidationError(err);
    if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError")
      err = handleJasonWebTokenError(err);
    generateProductionError(err, req, res);
  }
  next();
};

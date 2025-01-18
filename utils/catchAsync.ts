import { Request, Response, NextFunction } from "express";
import { ProtectedRequest } from "../controllers/auth/types";

type handlerFunction = (
  req: Request | ProtectedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (asyncFunction: handlerFunction) => {
  return function (
    req: Request | ProtectedRequest,
    res: Response,
    next: NextFunction
  ) {
    asyncFunction(req, res, next).catch(next);
  };
};

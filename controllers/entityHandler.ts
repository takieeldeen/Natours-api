import { Model } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ProtectedRequest } from "./auth/types";
import AppError from "../utils/AppError";

export default class EntityHandler<T> {
  public constructor(public model: Model<T>) {}

  public deleteOne() {
    return catchAsync(
      async (
        req: Request | ProtectedRequest,
        res: Response,
        next: NextFunction
      ) => {
        const doc = await this.model.findById(req.params.id);
        if (!doc)
          return next(new AppError("Document doesnt exist with that id", 404));

        await this.model.findByIdAndDelete(req.params.id);

        res.status(204).json({
          status: "success",
        });
      }
    );
  }
}

import { Request, Response, NextFunction } from "express";
import User from "../../models/userModel";
import { catchAsync } from "../../utils/catchAsync";

/**
 * Register new user
 */
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
    next();
  }
);

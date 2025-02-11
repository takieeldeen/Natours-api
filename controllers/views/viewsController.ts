import { NextFunction, Request, Response } from "express";
import Tour from "../../models/tourModel";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";

export const getOverviewPage = async (req: Request, res: Response) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    tours,
  });
};

export const getTourPage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourSlug = req.params.tourSlug;
    const tour = await Tour.findOne({ slug: tourSlug }).populate({
      path: "reviews",
      select: "review user rating",
    });
    if (!tour) return next(new AppError("Invalid tour Id", 404));
    res.status(200).render("tour", {
      title: tour.name,
      tour,
    });
  }
);

export const getLoginPage = (req, res) => {
  res.status(200).render("login", {
    title: "Log in to your account",
  });
};

export const getMyAccountPage = catchAsync(async (req, res) => {
  // const userId =
  res.status(200).render("my_account", {
    title: "My Account",
  });
});

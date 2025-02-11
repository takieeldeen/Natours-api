import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ProtectedRequest } from "../auth/types";
import Tour from "../../models/tourModel";
import AppError from "../../utils/AppError";
import Review from "../../models/reviewModel";
import Handler from "../entityHandler";

const reviewsHandler = new Handler(Review);

export const setUserAndTourId = catchAsync(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    if (!req.body.user) req.body.user = req?.user.id;
    if (!req.body.tour) req.body.tour = req.params.id;
    next();
  }
);
// export const createReview = catchAsync(
//   async (req: ProtectedRequest, res: Response, next: NextFunction) => {
//     if (!req.body.user) req.body.user = req?.user.id;
//     if (!req.body.tour) req.body.tour = req.params.id;
//     const { review, rating, tour, user } = req.body;
//     const tourData = await Tour.findById(tour);
//     if (!tourData) return next(new AppError("Invalid Tour Id", 400));
//     const createdReview = await Review.create({ review, rating, tour, user });
//     res.status(201).json({
//       status: "success",
//       review: createdReview,
//     });
//   }
// );

export const getTourReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new AppError("Please Enter the tour id", 400));
    const tour = await Tour.findById(id);
    if (!tour) return next(new AppError("This Tour Doesnt exist", 404));
    const reviews = await Review.find({ tour: id });
    res.status(200).json({
      status: "success",
      results: reviews?.length,
      reviews,
    });
  }
);

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  // Check for tourId
  const { id } = req.params;
  let filter = {};
  if (id) filter = { tour: req.params.id };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// export const duplicateReviewsGuard = catchAsync(
// async (req: ProtectedRequest, res: Response, next: NextFunction) => {
// const userId = req?.user?.id;
// const tourId = req?.params?.id;
// const authorReviews = await Review.find({ user: userId, tour: tourId });
// if (authorReviews?.length > 0)
// return next(
// new AppError("Can't Write Duplicate reviews for the same tour", 400)
// );
// next();
// }
// );
//
export const deleteReview = reviewsHandler.deleteOne();
export const updateReview = reviewsHandler.updateOne();
export const createReview = reviewsHandler.createOne();

import { Router } from "express";
import { reviewController } from "../controllers/reviews";
import { authController } from "../controllers/auth";

const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route("/")
  .post(
    authController.protectRoute,
    authController.restrictTo("user"),
    reviewController.setUserAndTourId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

reviewRouter
  .route("/:id")
  .delete(authController.protectRoute, reviewController.deleteReview);

export default reviewRouter;

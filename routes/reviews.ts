import { Router } from "express";
import { reviewController } from "../controllers/reviews";
import { authController } from "../controllers/auth";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(authController.protectRoute);

reviewRouter
  .route("/")
  .post(
    authController.restrictTo("user", "admin"),
    reviewController.setUserAndTourId,
    // reviewController.duplicateReviewsGuard,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

reviewRouter
  .route("/:id")
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

export default reviewRouter;

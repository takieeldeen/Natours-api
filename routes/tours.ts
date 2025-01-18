import express from "express";
import * as tourController from "../controllers/tours/tourController";
import { authController } from "../controllers/auth";
import reviewRouter from "./reviews";
const tourRouter = express.Router();
// Param Middleware that runs only when id param exists
// tourRouter.param('id', tourController.checkTourId);

tourRouter.route("/stats").get(tourController.getTourStats);
tourRouter.route("/monthlyPlans/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.topCheap, tourController.getAllTours);

tourRouter
  .route("/")
  .get(authController.protectRoute, tourController.getAllTours)
  .post(tourController.createTour);
// .post(tourController.checkTourBody, tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

tourRouter.use("/:id/reviews", reviewRouter);
// tourRouter
//   .route("/:tourId/reviews")
//   .post(
//     authController.protectRoute,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   )
//   .get(reviewController.getTourReviews);
export default tourRouter;

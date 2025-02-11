import express from "express";
import * as tourController from "../controllers/tours/tourController";
import { authController } from "../controllers/auth";
import reviewRouter from "./reviews";
const tourRouter = express.Router();
// Param Middleware that runs only when id param exists
// tourRouter.param('id', tourController.checkTourId);

tourRouter.route("/stats").get(tourController.getTourStats);
tourRouter
  .route("/monthlyPlans/:year")
  .get(
    authController.protectRoute,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

tourRouter
  .route("/top-5-cheap")
  .get(tourController.topCheap, tourController.getAllTours);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protectRoute,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );
// .post(tourController.checkTourBody, tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protectRoute,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

tourRouter
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

tourRouter
  .route("/distances/:latlng/unit/:unit")
  .get(tourController.getToursDistances);

tourRouter.use("/:id/reviews", reviewRouter);

export default tourRouter;

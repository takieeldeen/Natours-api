"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tours_1 = require("../controllers/tours");
const tourRouter = express_1.default.Router();
// Param Middleware that runs only when id param exists
// tourRouter.param('id', tourController.checkTourId);
tourRouter.route("/stats").get(tours_1.tourController.getTourStats);
tourRouter.route("/monthlyPlans/:year").get(tours_1.tourController.getMonthlyPlan);
tourRouter
    .route("/top-5-cheap")
    .get(tours_1.tourController.topCheap, tours_1.tourController.getAllTours);
tourRouter
    .route("/")
    .get(tours_1.tourController.getAllTours)
    .post(tours_1.tourController.createTour);
// .post(tourController.checkTourBody, tourController.createTour);
tourRouter
    .route("/:id")
    .get(tours_1.tourController.getTour)
    .patch(tours_1.tourController.updateTour)
    .delete(tours_1.tourController.deleteTour);
exports.default = tourRouter;
//# sourceMappingURL=tours.js.map
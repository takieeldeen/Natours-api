"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const auth_1 = require("../controllers/auth");
const reviewRouter = (0, express_1.Router)({ mergeParams: true });
reviewRouter
    .route("/")
    .post(auth_1.authController.protectRoute, auth_1.authController.restrictTo("user"), reviews_1.reviewController.createReview)
    .get(reviews_1.reviewController.getAllReviews);
reviewRouter
    .route("/:id")
    .delete(auth_1.authController.protectRoute, reviews_1.reviewController.deleteReview);
exports.default = reviewRouter;
//# sourceMappingURL=reviews.js.map
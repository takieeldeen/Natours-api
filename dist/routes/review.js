"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const auth_1 = require("../controllers/auth");
const reviewRouter = (0, express_1.Router)();
reviewRouter.post("/", auth_1.authController.protectRoute, reviews_1.reviewController.createReview);
exports.default = reviewRouter;
//# sourceMappingURL=review.js.map
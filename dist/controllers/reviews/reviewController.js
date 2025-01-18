"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getAllReviews = exports.getTourReviews = exports.createReview = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const tourModel_1 = __importDefault(require("../../models/tourModel"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const reviewModel_1 = __importDefault(require("../../models/reviewModel"));
const entityHandler_1 = __importDefault(require("../entityHandler"));
const reviewsHandler = new entityHandler_1.default(reviewModel_1.default);
exports.createReview = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.user)
        req.body.user = req === null || req === void 0 ? void 0 : req.user.id;
    if (!req.body.tour)
        req.body.tour = req.params.id;
    const { review, rating, tour, user } = req.body;
    const tourData = yield tourModel_1.default.findById(tour);
    if (!tourData)
        return next(new AppError_1.default("Invalid Tour Id", 400));
    const createdReview = yield reviewModel_1.default.create({ review, rating, tour, user });
    res.status(201).json({
        status: "success",
        review: createdReview,
    });
}));
exports.getTourReviews = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new AppError_1.default("Please Enter the tour id", 400));
    const tour = yield tourModel_1.default.findById(id);
    if (!tour)
        return next(new AppError_1.default("This Tour Doesnt exist", 404));
    const reviews = yield reviewModel_1.default.find({ tour: id });
    res.status(200).json({
        status: "success",
        results: reviews === null || reviews === void 0 ? void 0 : reviews.length,
        reviews,
    });
}));
exports.getAllReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for tourId
    const { id } = req.params;
    let filter = {};
    if (id)
        filter = { tour: req.params.id };
    const reviews = yield reviewModel_1.default.find(filter);
    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        },
    });
}));
exports.deleteReview = reviewsHandler.deleteOne();
//# sourceMappingURL=reviewController.js.map
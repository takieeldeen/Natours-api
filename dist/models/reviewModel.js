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
exports.reviewSchema = void 0;
const mongoose_1 = require("mongoose");
const tourModel_1 = __importDefault(require("./tourModel"));
exports.reviewSchema = new mongoose_1.Schema({
    review: {
        type: String,
        required: [true, "Please Enter the review message"],
    },
    rating: {
        type: Number,
        required: [true, "Please Enter the rating."],
        default: 5,
        min: [1, "A rating can't be less than one"],
        max: [5, "A rating can't be more than five"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Review Must belong to a tour"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Review Must belong to a user"],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Unique Compound Index to clear
exports.reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
exports.reviewSchema.statics.calculateAverageRatings = function (tourId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const stats = yield this.aggregate([
            {
                $match: { tour: tourId },
            },
            {
                $group: {
                    _id: "$tour",
                    nRatings: { $sum: 1 },
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);
        if ((stats === null || stats === void 0 ? void 0 : stats.length) > 0) {
            yield tourModel_1.default.findByIdAndUpdate(tourId, {
                ratingsAverage: (_a = stats === null || stats === void 0 ? void 0 : stats[0]) === null || _a === void 0 ? void 0 : _a.avgRating,
                ratingsQuantity: (_b = stats === null || stats === void 0 ? void 0 : stats[0]) === null || _b === void 0 ? void 0 : _b.nRatings,
            });
        }
        else {
            yield tourModel_1.default.findByIdAndUpdate(tourId, {
                ratingsAverage: 4.5,
                ratingsQuantity: 0,
            });
        }
    });
};
// Populating paths
exports.reviewSchema.pre(/^find/, function (next) {
    this === null || this === void 0 ? void 0 : this.populate({
        path: "user",
        select: "photo name",
    });
    // .populate({
    //   path: "user",
    // });
    next();
});
// Calculating Average Rating on Adding New Review
exports.reviewSchema.post("save", function () {
    this.constructor.calculateAverageRatings(this.tour);
});
// Calculating Average Rating on Deleting and Updating Existing Review
exports.reviewSchema.post(/^findOneAnd/, function (review) {
    console.log(`current Review ${review === null || review === void 0 ? void 0 : review.tour}`);
    (this === null || this === void 0 ? void 0 : this.model).calculateAverageRatings(review === null || review === void 0 ? void 0 : review.tour);
});
const Review = (0, mongoose_1.model)("Review", exports.reviewSchema);
exports.default = Review;
//# sourceMappingURL=reviewModel.js.map
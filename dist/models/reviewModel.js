"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = require("mongoose");
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
const Review = (0, mongoose_1.model)("Review", exports.reviewSchema);
exports.default = Review;
//# sourceMappingURL=reviewModel.js.map
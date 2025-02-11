import { model, Schema } from "mongoose";
import Tour from "./tourModel";

export const reviewSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review Must belong to a tour"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Review Must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Unique Compound Index to clear

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRatings = async function (tourId: string) {
  const stats = await this.aggregate([
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
  if (stats?.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats?.[0]?.avgRating,
      ratingsQuantity: stats?.[0]?.nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

// Populating paths
reviewSchema.pre(/^find/, function (next) {
  (this as any)?.populate({
    path: "user",
    select: "photo name",
  });
  // .populate({
  //   path: "user",
  // });
  next();
});

// Calculating Average Rating on Adding New Review
reviewSchema.post("save", function () {
  (this.constructor as any).calculateAverageRatings(this.tour);
});
// Calculating Average Rating on Deleting and Updating Existing Review
reviewSchema.post(/^findOneAnd/, function (review) {
  console.log(`current Review ${review?.tour}`);
  (this?.model as any).calculateAverageRatings(review?.tour);
});

const Review = model("Review", reviewSchema);
export default Review;

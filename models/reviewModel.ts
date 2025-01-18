import { model, Schema } from "mongoose";

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

const Review = model("Review", reviewSchema);
export default Review;

import mongoose from "mongoose";
import slugify from "slugify";

export const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "A tour must have a unique name"],
      required: [true, "A tour must have a name"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: ["easy", "medium", "difficult"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export type TourType = {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string | undefined;
  imageCover: string;
  images: string[] | undefined;
  createdAt: Date;
  startDates: Date[];
};

const Tour = mongoose.model("Tour", tourSchema);

tourSchema.virtual("weekDuration").get(function () {
  return (this.duration / 7).toFixed(1);
});

// Documents Middleware
tourSchema.pre("validate", function () {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  console.log(this);
});

tourSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
});

tourSchema.post("deleteOne", (doc) => {
  console.log("Doc was deleted Successfully" + " " + doc._id);
});

export default Tour;

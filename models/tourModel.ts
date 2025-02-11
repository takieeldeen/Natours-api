import mongoose from "mongoose";
import slugify from "slugify";
// import validator from "validator";

export const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [
      //   validator.isAlpha,
      //   "Name must only contain alphabetic letters",
      // ],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
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
      validate: {
        validator: function validate(val: number) {
          return this.price > val;
        },
        message: "Price Discount ({VALUE}) can't be larger the original price",
      },
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
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
      description: String,
      address: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    guides: {
      type: Array,
      ref: "users",
    },
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
  startLocation: {
    type: "Point";
    coordinates: number[];
    description: string;
    address: string;
  };
  locations: {
    type: "Point";
    coordinates: number[];
    description: string;
    day: number;
  };
  guides: any[];
};

tourSchema.virtual("weekDuration").get(function () {
  return (this.duration / 7).toFixed(1);
});
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });
// console.log
// Documents Middleware
// Embedding Documents ///////////////////////////
// tourSchema.pre("save", async function (next) {
//   // Takie Method Method /////////////////////////////
//   this.guides = await User.find({ _id: { $in: this.guides } });
//   // Jonas Method /////////////////////////////
//   // const guidePromises = this.guides.map(
//   //   async (guideId) => await User.findById(guideId)
//   // );
//   // this.guides = await Promise.all(guidePromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  (this as any).populate({
    path: "guides",
  });
  next();
});

tourSchema.pre("save", async function (next) {
  const slug = slugify(this.name, { lower: true });
  this.set({ slug });
  next();
});

tourSchema.post("save", (doc, next) => {
  console.log("fired the post save hook");
  next();
});

tourSchema.post("deleteOne", (doc) => {
  console.log("Doc was deleted Successfully" + " " + doc._id);
});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;

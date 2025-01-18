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
exports.tourSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
// import validator from "validator";
exports.tourSchema = new mongoose_1.default.Schema({
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
            validator: function validate(val) {
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
        Coordinates: {
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
            Coordinates: [Number],
            description: String,
            day: Number,
        },
    ],
    guides: {
        type: Array,
        ref: "users",
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.tourSchema.virtual("weekDuration").get(function () {
    return (this.duration / 7).toFixed(1);
});
exports.tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id",
});
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
exports.tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
    });
    next();
});
exports.tourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const slug = (0, slugify_1.default)(this.name, { lower: true });
        this.set({ slug });
        next();
    });
});
exports.tourSchema.post("save", (doc, next) => {
    console.log("fired the post save hook");
    next();
});
exports.tourSchema.post("deleteOne", (doc) => {
    console.log("Doc was deleted Successfully" + " " + doc._id);
});
const Tour = mongoose_1.default.model("Tour", exports.tourSchema);
exports.default = Tour;
//# sourceMappingURL=tourModel.js.map
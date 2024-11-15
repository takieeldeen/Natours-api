"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
exports.tourSchema = new mongoose_1.default.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Tour = mongoose_1.default.model("Tour", exports.tourSchema);
exports.tourSchema.virtual("weekDuration").get(function () {
    return (this.duration / 7).toFixed(1);
});
// Documents Middleware
exports.tourSchema.pre("validate", function () {
    console.log(this);
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    console.log(this);
});
exports.tourSchema.post("save", (doc, next) => {
    console.log(doc);
    next();
});
exports.tourSchema.post("deleteOne", (doc) => {
    console.log("Doc was deleted Successfully" + " " + doc._id);
});
exports.default = Tour;
//# sourceMappingURL=tourModel.js.map
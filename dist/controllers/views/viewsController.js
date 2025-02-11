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
exports.getMyAccountPage = exports.getLoginPage = exports.getTourPage = exports.getOverviewPage = void 0;
const tourModel_1 = __importDefault(require("../../models/tourModel"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getOverviewPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tours = yield tourModel_1.default.find();
    res.status(200).render("overview", {
        tours,
    });
});
exports.getOverviewPage = getOverviewPage;
exports.getTourPage = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourSlug = req.params.tourSlug;
    const tour = yield tourModel_1.default.findOne({ slug: tourSlug }).populate({
        path: "reviews",
        select: "review user rating",
    });
    if (!tour)
        return next(new AppError_1.default("Invalid tour Id", 404));
    res.status(200).render("tour", {
        title: tour.name,
        tour,
    });
}));
const getLoginPage = (req, res) => {
    res.status(200).render("login", {
        title: "Log in to your account",
    });
};
exports.getLoginPage = getLoginPage;
exports.getMyAccountPage = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId =
    res.status(200).render("my_account", {
        title: "My Account",
    });
}));
//# sourceMappingURL=viewsController.js.map
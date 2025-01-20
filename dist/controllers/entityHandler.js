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
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = __importDefault(require("../utils/AppError"));
const QueryAPI_1 = require("../utils/QueryAPI");
class EntityHandler {
    constructor(model) {
        this.model = model;
    }
    deleteOne() {
        return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.model.findById(req.params.id);
            if (!doc)
                return next(new AppError_1.default("Document doesnt exist with that id", 404));
            yield this.model.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: "success",
            });
        }));
    }
    updateOne() {
        return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const updatedData = req === null || req === void 0 ? void 0 : req.body;
            const documentId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            const doc = yield this.model.findByIdAndUpdate(documentId, updatedData, { new: true, runValidators: true });
            if (!doc)
                return next(new AppError_1.default("Document doesnt exist with that id", 404));
            res.status(200).json({
                status: "success",
                data: doc,
            });
        }));
    }
    createOne() {
        return (0, catchAsync_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const documentData = req === null || req === void 0 ? void 0 : req.body;
            const doc = yield this.model.create(documentData);
            res.status(201).json({
                status: "success",
                data: doc,
            });
        }));
    }
    getOne(popOptions) {
        return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id)
                return next(new AppError_1.default("Please provide the document id", 400));
            let query = this.model.findById(id);
            if (popOptions)
                query = query.populate(popOptions);
            const doc = yield query;
            if (!doc)
                return next(new AppError_1.default("Document doesnt exist with that id", 404));
            res.status(200).json({
                status: "success",
                data: doc,
            });
        }));
    }
    getAll(resourceSchema) {
        return (0, catchAsync_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // The next three lines is to allow for nested reviews endpoint
            const { id } = req.params;
            let filter = {};
            if (id)
                filter = { tour: req.params.id };
            // Extracting all query (filters,sort,projection,...)
            const queryStrings = req.query;
            // Filtering the filter props only by Including only the schema props
            const queryObj = Object.assign({}, queryStrings);
            const docsQuery = new QueryAPI_1.QueryAPI(queryObj, resourceSchema, this.model.find(filter))
                .filter()
                .sort()
                .select()
                .paginate().query;
            const docs = yield docsQuery;
            // return the results
            res.status(200).json({
                status: "success",
                results: docs.length,
                data: docs,
            });
        }));
    }
}
exports.default = EntityHandler;
//# sourceMappingURL=entityHandler.js.map
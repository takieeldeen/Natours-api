"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const handleDatabaseCastError = (error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = `invalid ${error === null || error === void 0 ? void 0 : error.path}:${error === null || error === void 0 ? void 0 : error.value} `;
    return new AppError_1.default(message, 400);
};
const generateProductionError = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        // We want to know about the error in our server logs
        console.error(error);
        // We don't want to leak our Functional Error to the client
        res.status(500).json({
            status: "error",
            message: "Someting Went wrong",
        });
    }
};
const generateDevelopmentError = (error, res) => {
    res.status(error.statusCode).json({
        isOperational: error.isOperational,
        status: error.status,
        message: error.message,
        stack: error.stack,
        error,
    });
};
exports.default = (error, req, res, next) => {
    var _a, _b, _c;
    error.statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    error.status = (_b = error.status) !== null && _b !== void 0 ? _b : "error";
    error.isOperational = (_c = error.isOperational) !== null && _c !== void 0 ? _c : false;
    if (process.env.NODE_ENV === "development") {
        generateDevelopmentError(error, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let modifiedError = Object.assign({}, error);
        if ((error === null || error === void 0 ? void 0 : error.name) === "castError") {
            modifiedError = handleDatabaseCastError(error);
        }
        generateProductionError(modifiedError, res);
    }
    next();
};
//# sourceMappingURL=errorController.js.map
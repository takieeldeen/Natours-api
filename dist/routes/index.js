"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = exports.userRouter = exports.tourRouter = void 0;
var tours_1 = require("./tours");
Object.defineProperty(exports, "tourRouter", { enumerable: true, get: function () { return __importDefault(tours_1).default; } });
var users_1 = require("./users");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
var reviews_1 = require("./reviews");
Object.defineProperty(exports, "reviewRouter", { enumerable: true, get: function () { return __importDefault(reviews_1).default; } });
//# sourceMappingURL=index.js.map
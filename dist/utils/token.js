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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.authenticateUser = exports.generateNewToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const util_1 = require("util");
const generateNewToken = (id) => {
    const token = (0, jsonwebtoken_1.sign)({ id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_DURATION,
    });
    return token;
};
exports.generateNewToken = generateNewToken;
const authenticateUser = (user, statusCode, res) => {
    var _a;
    const token = (0, exports.generateNewToken)(user === null || user === void 0 ? void 0 : user.id);
    // const expirationDate = new Date(
    //   Date.now() + +process.env.COOKIE_EXPIRATION_DURATION * 24 * 60 * 60 * 100
    // );
    const expirationDuration = +process.env.COOKIE_EXPIRATION_DURATION * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        maxAge: expirationDuration,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    };
    (_a = res.cookie("session", token, cookieOptions).status(statusCode)) === null || _a === void 0 ? void 0 : _a.json({
        status: "success",
        token,
    });
};
exports.authenticateUser = authenticateUser;
const validateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = yield (0, util_1.promisify)(jsonwebtoken_1.verify)(token, process.env.TOKEN_SECRET);
    return decodedToken;
});
exports.validateToken = validateToken;
//# sourceMappingURL=token.js.map
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
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the user name"],
        minLength: [3, "Username can't be less than 3 letters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter the user email"],
        validate: {
            validator: validator_1.isEmail,
            message: "Please enter a valid email format",
        },
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter the user password"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter the password confirmation"],
        validate: {
            // This will Only work in creating new user (Not when reseting password)
            validator: function validatePasswordConfirm(confirmPassword) {
                return this.password === confirmPassword;
            },
        },
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "lead-guide", "guide", "user"],
        default: "user",
    },
    changePasswordAt: {
        type: Date,
        default: new Date(),
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiration: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
    },
});
// Pre-Query MiddleWare /////////////////////////////////////////
exports.userSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
// Pre-Save MiddleWare //////////////////////////////////////////
exports.userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew)
        return next();
    this.changePasswordAt = new Date(Date.now() - 1000);
    next();
});
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Run the encryption function only if the user is modifying the password
        if (!this.isModified("password"))
            return next();
        //   hash the password with 2^12 iterations
        this.password = yield (0, bcrypt_1.hash)(this.password, 12);
        // Remove the confirmation password
        this.confirmPassword = undefined;
        next();
    });
});
// Schema Methods ///////////////////////////////
exports.userSchema.methods.checkPassword = (userPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, bcrypt_1.compare)(userPassword, hashedPassword);
});
exports.userSchema.methods.changePasswordAfter = function (tokenGenerationDate) {
    return tokenGenerationDate < this.changePasswordAt.getTime() / 1000;
};
exports.userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = (0, crypto_1.randomBytes)(32).toString("hex");
    const hashedToken = (0, crypto_1.createHash)("sha256").update(resetToken).digest("hex");
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpiration =
        Date.now() + +process.env.RESET_TOKEN_DURATION * 60 * 1000;
    return resetToken;
};
const User = (0, mongoose_1.model)("users", exports.userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map
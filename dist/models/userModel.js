"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const userSchema = new mongoose_1.Schema({
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
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter the password confirmation"],
        validate: {
            validator: () => { },
        },
    },
});
const User = (0, mongoose_1.model)("users", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map
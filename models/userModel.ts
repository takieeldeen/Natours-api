import { Schema, model } from "mongoose";
import { isEmail } from "validator";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter the user name"],
    minLength: [3, "Username can't be less than 3 letters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter the user email"],
    validate: {
      validator: isEmail,
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
      validator: () => {},
    },
  },
});

const User = model("users", userSchema);
export default User;

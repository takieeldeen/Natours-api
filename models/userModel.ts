import { CallbackWithoutResultAndOptionalError, Schema, model } from "mongoose";
import { isEmail } from "validator";
import { hash, compare } from "bcrypt";
import { randomBytes, createHash } from "crypto";

export const userSchema = new Schema({
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
userSchema.pre(/^find/, function (next: CallbackWithoutResultAndOptionalError) {
  (this as any).find({ isDeleted: { $ne: true } });
  next();
});
// Pre-Save MiddleWare //////////////////////////////////////////
userSchema.pre("save", function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified("password") || this.isNew) return next();
  this.changePasswordAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    // Run the encryption function only if the user is modifying the password
    if (!this.isModified("password")) return next();
    //   hash the password with 2^12 iterations
    this.password = await hash(this.password, 12);
    // Remove the confirmation password
    this.confirmPassword = undefined;
    next();
  }
);
// Schema Methods ///////////////////////////////

userSchema.methods.checkPassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(userPassword, hashedPassword);
};

userSchema.methods.changePasswordAfter = function (
  tokenGenerationDate: number
) {
  return tokenGenerationDate < this.changePasswordAt.getTime() / 1000;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpiration =
    Date.now() + +process.env.RESET_TOKEN_DURATION * 60 * 1000;
  return resetToken;
};

const User = model("users", userSchema);
export default User;

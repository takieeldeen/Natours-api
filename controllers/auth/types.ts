import { Document } from "mongoose";
import { Request } from "express";

export interface UserDocument extends Document {
  name: string;
  email: string;
  photo: string | undefined;
  password: string;
  confirmPassword: undefined;
  role: "admin" | "lead-guide" | "user" | "guide";
  changePasswordAt: Date;
  resetPasswordToken: string | undefined;
  resetPasswordExpiration: Date;
  isDeleted: boolean;
}

export interface ProtectedRequest extends Request {
  user: UserDocument;
}

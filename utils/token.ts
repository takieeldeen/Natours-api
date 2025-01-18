import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";
import { CookieOptions, Response } from "express";

export const generateNewToken = (id: unknown) => {
  const token = sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_DURATION,
  });
  return token;
};

export const authenticateUser = (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = generateNewToken(user?.id);
  // const expirationDate = new Date(
  //   Date.now() + +process.env.COOKIE_EXPIRATION_DURATION * 24 * 60 * 60 * 100
  // );
  const expirationDuration =
    +process.env.COOKIE_EXPIRATION_DURATION * 24 * 60 * 60 * 1000;

  const cookieOptions: CookieOptions = {
    maxAge: expirationDuration,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
  res.cookie("session", token, cookieOptions).status(statusCode)?.json({
    status: "success",
    token,
  });
};

export const validateToken = async (token: string) => {
  const decodedToken: Promise<any> = await (promisify(verify) as any)(
    token,
    process.env.TOKEN_SECRET
  );
  return decodedToken;
};

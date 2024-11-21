import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user-repository";
import { CustomError } from "../middlewares/error-handler";
import { JWT_SECRET } from "../config/env";

export async function createToken(user: User, type?: string) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };
  return jwt.sign(payload, JWT_SECRET, options);
}

export async function verifyRefreshToken(userId: string, refreshToken: string) {
  const user = await userRepository.findUniqueOrThrowtData({
    where: { id: userId },
  });

  if (user.refreshToken !== refreshToken) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return await createToken(user);
}


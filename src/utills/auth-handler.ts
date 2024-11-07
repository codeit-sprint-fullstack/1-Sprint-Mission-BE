import bcrypt from "bcrypt";
import { CustomError } from "../middlewares/error-handler";
import { User } from "@prisma/client";

function filterSensitiveUserData(authResult: User) {
  const { encryptedPassword, refreshToken, ...rest } = authResult;
  return rest;
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

export { filterSensitiveUserData, hashPassword, verifyPassword };

import argon2 from "argon2";
import crypto from "crypto";

import { CustomError } from "./error";

import { ARGON2_SECRET_KEY, ARGON2_SALT } from "../config";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(ARGON2_SALT);
  const secretKey = Buffer.from(ARGON2_SECRET_KEY);

  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      secret: secretKey,
      salt: salt,
    });
    return hash;
  } catch (error) {
    throw new CustomError(50021);
  }
}

export async function verifyPassword({
  hashedPassword,
  plainPassword,
}: {
  hashedPassword: string;
  plainPassword: string;
}): Promise<boolean> {
  try {
    const secretKey = Buffer.from(ARGON2_SECRET_KEY);
    const isMatch = await argon2.verify(hashedPassword, plainPassword, {
      secret: secretKey,
    });
    return isMatch;
  } catch (error) {
    throw new CustomError(50022);
  }
}

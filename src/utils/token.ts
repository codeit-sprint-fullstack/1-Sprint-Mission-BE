import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";

import { CustomError } from "./error";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants/token";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config";

export function createAccessToken(userId: string): string {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function createRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function extractUserIdFromRefreshToken(
  RefreshToken: string
): string | JsonWebTokenError | TokenExpiredError | CustomError {
  try {
    const decoded = jwt.verify(RefreshToken, REFRESH_TOKEN_SECRET) as {
      id: string;
    };

    return decoded.id;
  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError) {
      return new CustomError(50020); // 에러 종류 확인 필요
    }

    return new CustomError(50020);
  }
}

export function validateAccessToken(
  token: string
): string | JwtPayload | CustomError {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    if (typeof decoded.id === "string") {
      return decoded.id;
    }

    return new CustomError(40049);
  } catch (err) {
    return new CustomError(40049);
  }
}

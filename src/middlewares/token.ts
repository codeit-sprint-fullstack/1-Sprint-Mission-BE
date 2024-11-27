import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { validateAccessToken } from "../utils/token";
import { CustomError } from "../utils/error";

export function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const accessToken = req.headers.authorization?.split(" ")[1];
  let userId: string | JwtPayload | CustomError = "";

  if (typeof accessToken === "string") {
    userId = validateAccessToken(accessToken);
  }

  if (userId instanceof CustomError) {
    next(userId);
    return;
  }

  res.locals.userId = userId;
  next();
  return;
}

export function checkToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const accessToken = req.headers.authorization?.split(" ")[1];
  let userId: string | JwtPayload | CustomError = "";

  if (typeof accessToken === "string") {
    userId = validateAccessToken(accessToken);
  }

  if (userId instanceof CustomError) {
    res.locals.userId = null;
    next();
    return;
  }

  res.locals.userId = userId;
  next();
  return;
}

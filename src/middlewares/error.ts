import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";

import { CustomError } from "../utils/error";

import { CUSTOM_ERROR_INFO } from "../constants/error";

export function logErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  next(err);
}

export function validationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: Result<ValidationError> = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).send({ message: errors.array()[0].msg });
}

export function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof CustomError) {
    res.status(err.status).send({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).send({
        message: CUSTOM_ERROR_INFO[40901] + ": " + err.meta?.target,
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).send({ message: CUSTOM_ERROR_INFO[40400] });
      return;
    }

    res.status(400).send({ message: err.message });
    return;
  }

  next(err);
}

export function serverErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(500).send({ message: "Internal server error: " + err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).send({ message: "Unknown request error: " + err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(500).send({ message: "Initialization error: " + err.message });
    return;
  }

  res.status(500).send({ message: err.message });
}

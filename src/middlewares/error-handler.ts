import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

export interface CustomError extends Error {
  status?: number;
  message: string;
  code?: string;
  data?: string;
}

function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number;

  if (
    error.name === "StructError" ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof multer.MulterError ||
    error.code === "P2003"
  ) {
    status = 400;
  } else if (error.name === "UnauthorizedError") {
    status = 401;
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    status = 404;
  } else if (error.code === "P2002") {
    status = 409;
  } else {
    status = error.status ?? 500;
  }

  res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}

export default errorHandler;

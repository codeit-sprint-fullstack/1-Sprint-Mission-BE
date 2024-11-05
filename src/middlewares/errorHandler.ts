import { Response, Request, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
  name: string;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error occurred:", err);

  const statusCode =
    err.status ||
    (err.name === "ValidationError"
      ? 400
      : err.name === "NotFoundError"
      ? 404
      : err.name === "UnauthorizedError"
      ? 401
      : 500);

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

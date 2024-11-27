import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;

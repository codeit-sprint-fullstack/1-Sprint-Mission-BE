import { Prisma } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";

export default function asyncHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (e: unknown) {
      const error = e as Error;
      if (
        error.name === "ValidationError" ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: error.message } as ResBody);
      } else if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: error.message } as ResBody);
      }
    }
  };
}

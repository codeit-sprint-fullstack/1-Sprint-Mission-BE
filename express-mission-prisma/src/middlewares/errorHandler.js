import { Prisma } from "@prisma/client";
import multer from "multer";

function errorHandler(error, req, res, next) {
  let status;

  if (
    error.name === "StructError" ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof multer.MulterError ||
    error.code === "P2003"
  ) {
    status = 400;
  } else if (error.name === "UnauthorizedError") {
    status = 401;
  }  else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    status = 404;
  } else if (error.code === "P2002") {
    status = 409;
  } else {
    status = error.code ?? 500;
  }

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}

export default errorHandler;

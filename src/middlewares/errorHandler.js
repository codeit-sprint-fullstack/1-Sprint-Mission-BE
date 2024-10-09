import { Prisma } from '@prisma/client';
import { cookieOptions } from '../config/authOptions.js';

export default function errorHandler(error, req, res, next) {
  console.error(error.stack);

  if (
    error.name === 'StructError' ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).json({
      path: req.path,
      method: req.method,
      message: error.message,
      data: error.data ?? undefined,
      date: new Date(),
    });
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    res.status(404).json({
      path: req.path,
      method: req.method,
      message: error.message,
      data: error.data ?? undefined,
      date: new Date(),
    });
  }

  if (error.message === 'Not available refresh token') {
    res.clearCookie('refreshToken', cookieOptions);
    res.status(401);
  }

  const status = error.code || 500;
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? 'Internal Server Error',
    data: error.data ?? undefined,
    date: new Date(),
  });
}

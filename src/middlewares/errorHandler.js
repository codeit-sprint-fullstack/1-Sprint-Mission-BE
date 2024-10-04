export default function errorHandler(error, req, res, next) {
  console.error(error.stack);
  if (
    err.name === "StructError" ||
    err instanceof Prisma.PrismaClientValidationError
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
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    res.status(404).json({
      path: req.path,
      method: req.method,
      message: error.message,
      data: error.data ?? undefined,
      date: new Date(),
    });
  }

  const status = error.status || 500;
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  console.error(err);
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: err.message ?? "Internal Server Error",
    data: err.data ?? undefined,
    date: new Date(),
  });
}

export default errorHandler;

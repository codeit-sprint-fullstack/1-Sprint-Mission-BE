export const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  let statusCode = 500;

  if (err.name === "ValidationError") {
    statusCode = 400;
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
  }

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: err.stack,
  });
};

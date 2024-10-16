const { CommonException } = require("../../errors/index");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CommonException) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
      identifier: err.identifier,
      occuredAt: err.occuredAt,
    });
  }

  res.status(500).json({
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || "Internal Server Error",
    identifier: "SYSTEM_ERROR",
    occuredAt: new Date().toISOString(),
  });
};

module.exports = errorHandler;

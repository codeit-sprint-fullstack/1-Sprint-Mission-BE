"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);
    const statusCode = err.status ||
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
exports.errorHandler = errorHandler;

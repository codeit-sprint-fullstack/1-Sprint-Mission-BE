import CustomError from "../utils/customError";

// 에러 핸들러 미들웨어
export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "잘못된 요청입니다" });
};

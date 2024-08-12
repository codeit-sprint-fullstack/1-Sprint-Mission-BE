const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  let statusCode = 500;
  let message = "서버 내부 오류입니다. 관리자에게 문의해주세요.";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "잘못된 요청입니다. 필수 필드를 확인해주세요.";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "유효하지 않은 ID입니다.";
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// 에러 핸들러 미들웨어
const errorHandler: ErrorRequestHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.error(err); // 에러 로그 출력

  // 추가적으로 비동기 처리를 할 경우 await 사용
  // await someAsyncLoggingFunction(err);

  res.status(500).json({ message: 'Internal Server Error' });
};

export default errorHandler;

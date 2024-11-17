import { Request, Response, NextFunction } from 'express'; // Express의 타입들을 가져옵니다.

// 에러 핸들링 미들웨어
const errorHandler = (
  err: any, // 에러 객체의 타입을 any로 지정합니다.
  req: Request, // 요청 객체의 타입을 지정합니다.
  res: Response, // 응답 객체의 타입을 지정합니다.
  next: NextFunction // 다음 미들웨어 함수를 호출하기 위한 함수입니다.
) => {
  // 응답 상태가 200일 경우 500으로 설정, 아니면 기존 상태 코드 유지
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode); // 에러 상태 코드로 응답 설정

  res.json({
    message: err.message, // 에러 메시지
    stack: err.stack, // 에러 발생 위치 - 개발용
  });
};

export default errorHandler; // 모듈을 내보냅니다.

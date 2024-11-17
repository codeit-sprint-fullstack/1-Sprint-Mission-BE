import { validationResult } from 'express-validator'; // 'express-validator'에서 validationResult 함수를 가져옵니다.
import { Request, Response, NextFunction } from 'express'; // Express의 타입들을 가져옵니다.

// 요청 데이터 검증 미들웨어
const validationMiddleware = (
  req: Request, // 요청 객체의 타입을 지정합니다.
  res: Response, // 응답 객체의 타입을 지정합니다.
  next: NextFunction // 다음 미들웨어 함수를 호출하기 위한 타입입니다.
) => {
  const errors = validationResult(req); // 요청 객체에서 검증 결과를 확인합니다.
  if (!errors.isEmpty()) {
    // 에러가 있으면
    return res.status(400).json({ errors: errors.array() }); // 400 상태와 함께 에러 목록 반환
  }
  next(); // 에러가 없으면 다음 미들웨어로 이동
};

export default validationMiddleware; // 모듈을 내보냅니다.

import jwt from 'jsonwebtoken'; // 'jsonwebtoken' 모듈을 가져옵니다.
import { Request, Response, NextFunction } from 'express'; // Express의 타입들을 가져옵니다.

// 사용자 정의 Request 인터페이스를 생성하여 'user' 속성을 추가합니다.
interface AuthenticatedRequest extends Request {
  user?: { id: number }; // 'user' 객체에 'id' 속성을 추가합니다.
}

// JWT 인증 미들웨어 => 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 하기 위해서 만듦
const authMiddleware = (
  req: AuthenticatedRequest, // 확장된 Request 타입 사용
  res: Response,
  next: NextFunction
) => {
  // 헤더에서 토큰 가져오기 (Bearer [token] 형태)
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: '접근이 거부되었습니다.' }); // 토큰이 없으면 401 상태로 접근 거부 메시지 반환

  try {
    const jwtSecret = process.env.JWT_SECRET; // 환경 변수에서 JWT 시크릿 키를 가져옵니다.
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined'); // 시크릿 키가 없으면 에러를 발생시킵니다.
    }

    // 토큰 검증
    const verified = jwt.verify(token, jwtSecret) as jwt.JwtPayload & {
      userId: number;
    };

    // 검증된 userId를 req.user에 저장
    req.user = { id: verified.userId };

    next(); // 인증이 성공하면 다음 미들웨어로 이동
  } catch (error) {
    res.status(401).json({ error: '유효한 토큰이 만료되었습니다.' }); // 토큰이 유효하지 않거나 만료되었을 때 에러 메시지 반환
  }
};

export default authMiddleware; // 모듈을 내보냅니다.

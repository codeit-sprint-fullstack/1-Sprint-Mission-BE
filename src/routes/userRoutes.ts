import express, { Request, Response, NextFunction } from 'express';
import { signup, login, refreshToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/authenticateToken';
import { getUser } from '../controllers/userController';

// 사용자 요청 객체에 사용자 정보가 포함될 때 타입 정의
interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

const router = express.Router();

// 회원가입
router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  signup(req, res, next);
});

// 로그인
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next);
});

// 토큰 갱신
router.post(
  '/refreshToken',
  (req: Request, res: Response, next: NextFunction) => {
    refreshToken(req, res, next);
  }
);

// 사용자 정보 조회
router.get(
  '/me',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest; // 타입 단언을 사용해 타입을 CustomRequest로 캐스팅
    getUser(customReq, res, next);
  }
);

export default router;

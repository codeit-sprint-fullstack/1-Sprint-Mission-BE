import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customReq';

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰 형식에서 토큰 추출

  if (!token) {
    res.status(401).json({ message: '인증 토큰이 없습니다.' });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = user as { userId: number; email: string };
    next();
  });
};

export default authenticateToken;

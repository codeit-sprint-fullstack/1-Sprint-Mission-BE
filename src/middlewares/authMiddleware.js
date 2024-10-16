// authMiddleware.js

import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorMiddleware.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(new UnauthorizedError('인증 토큰이 필요합니다.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new UnauthorizedError('유효하지 않은 토큰입니다.'));
    }
    req.user = user;
    next();
  });
};

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      success: false,
      message: '인증 헤더가 없습니다.',
    });
  }

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    return res.status(400).json({
      success: false,
      message: '지원하지 않는 인증 방식입니다.',
    });
  }

  if (!accessToken) {
    const error = new Error('권한이 없습니다.');
    error.code = 400;
    error.status = 400;
    return next(error); 
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      const error = new Error('다시 로그인해 주세요.');
      error.code = 401; 
      error.status = 401;
      return next(error); 
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        const error = new Error('회원 정보가 없습니다.');
        error.code = 404;
        error.status = 404;
        return next(error); 
      }

      req.user = user;
      next();
    } catch (err) {
      const error = new Error('서버 오류입니다.');
      error.code = 500;
      error.status = 500;
      return next(error);
    }
  });
};

export default AuthMiddleware;

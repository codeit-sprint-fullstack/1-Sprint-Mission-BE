import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    return res.status(400).json({
      success: false,
      message: '지원하지 않는 인증 방식입니다.',
    });
  }

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: 'AccessToken이 없습니다.',
    });
  }

  // if (!token) {
  //   return res.status(401).json({ message: 'Access token is required.' });
  // }

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      console.log(user);

      
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
};

export default AuthMiddleware;

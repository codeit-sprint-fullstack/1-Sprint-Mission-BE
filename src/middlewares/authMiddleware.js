import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; // "Bearer <token>" 형식에서 토큰 추출

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Access token is required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
};

export default AuthMiddleware;

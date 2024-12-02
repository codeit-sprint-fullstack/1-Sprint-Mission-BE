import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import env from '../env';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.baseUrl,
    },
  },
});
dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
} else if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET is not defined');
}

export interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, nickname, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const encryptedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user: User = await prisma.user.create({
      data: {
        email,
        nickName: nickname,
        encryptedPassword,
      },
    });

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // DB에 리프레시 토큰 저장
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.status(201).json({
      message: '회원가입 성공',
      user: { id: user.id, email: user.email, nickName: user.nickName },
      accessToken,
    });
  } catch (error) {
    console.error('회원가입 중 오류:', error);
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, password } = req.body;

    // 사용자 확인
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 리프레시 토큰 처리
    let refreshToken = user.refreshToken;

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
      } catch (err) {
        console.log('Refresh token is invalid or expired. Creating a new one.');
        refreshToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.REFRESH_TOKEN_SECRET as string,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken },
        });
      }
    } else {
      refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({
      message: '로그인 성공',
      user: { id: user.id, email: user.email, nickName: user.nickName },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
    } catch (error) {
      return res
        .status(403)
        .json({ message: '유효하지 않은 또는 만료된 토큰입니다.' });
    }

    if (typeof decoded === 'object' && decoded.userId) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: '해당 사용자 정보가 없습니다.' });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return res.status(200).json({
        message: '토큰 갱신 성공',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      // decoded가 객체가 아니거나 userId가 없는 경우
      return res
        .status(403)
        .json({ message: '유효하지 않은 토큰 데이터입니다.' });
    }
  } catch (error) {
    console.error('인증 토큰 오류:', error);
    next(error);
  }
}

export default {
  signup,
  login,
  refreshToken,
};

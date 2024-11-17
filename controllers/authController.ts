import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

// 회원가입 (Sign Up)
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 이메일, 비밀번호, 닉네임을 req.body에서 가져옵니다.
  const { email, password, nickname } = req.body as {
    email: string;
    password: string;
    nickname: string;
  };

  try {
    // 비밀번호를 해시화합니다. (bcrypt 패키지 사용)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prisma를 사용하여 새로운 유저를 생성합니다.
    const user = await prisma.user.create({
      data: {
        email, // 가입하는 이메일
        nickname, // 가입하는 닉네임
        password: hashedPassword, // 해시화된 비밀번호를 저장합니다.
      },
    });

    // JWT 토큰을 발급합니다.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined'); // JWT_SECRET이 설정되어 있지 않으면 에러 발생
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h', // 유효기간 1시간
    });

    // accessToken과 nickname을 반환합니다.
    res.status(201).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달합니다.
  }
};

// 로그인 (Sign In)
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 이메일과 비밀번호를 req.body에서 가져옵니다.
  const { email, password } = req.body as { email: string; password: string };

  try {
    // 이메일로 사용자 검색
    const user = await prisma.user.findUnique({ where: { email } });

    // 사용자가 없거나 비밀번호가 일치하지 않으면 에러 메시지 반환
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT 토큰을 발급합니다.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined'); // JWT_SECRET이 설정되어 있지 않으면 에러 발생
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h', // 유효기간 1시간
    });

    // accessToken과 nickname을 반환합니다.
    res.status(200).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달합니다.
  }
};

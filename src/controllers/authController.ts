import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
    nickname: string;
  };
}

interface SignInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// 회원가입
export const signUp = async (req: SignUpRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, nickname } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    // accessToken과 nickname 반환
    res.status(201).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error);
  }
};

// 로그인
export const signIn = async (req: SignInRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    // accessToken과 nickname 반환
    res.status(200).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error);
  }
};

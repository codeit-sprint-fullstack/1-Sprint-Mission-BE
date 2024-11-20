import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

// 사용자 요청 객체에 사용자 정보가 포함될 때 타입 정의
export interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

// 사용자 정보 조회
export async function getUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { userId } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보를 클라이언트에 반환
    return res.status(200).json({
      message: '사용자 정보 조회 성공',
      user,
    });
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    return res
      .status(500)
      .json({ message: '사용자 정보를 조회할 수 없습니다.' });
  }
}

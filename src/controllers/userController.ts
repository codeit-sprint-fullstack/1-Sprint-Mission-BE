import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User, Product } from '@prisma/client'; // Product를 import
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 현재 유저 정보 조
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: req.user?.id as number },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 유저 정보 업데이트
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { image } = req.body;
  try {
    const user: User = await prisma.user.update({
      where: { id: req.user?.id as number },
      data: { image },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        password: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { currentPassword, password, passwordConfirmation } = req.body;

  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: req.user?.id as number },
    });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(400).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
      return;
    }

    if (password !== passwordConfirmation) {
      res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser: User = await prisma.user.update({
      where: { id: req.user?.id as number },
      data: { password: hashedPassword },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        password: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// 유저의 상품 목록 조회
export const getUserProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  try {
    const products: Product[] = await prisma.product.findMany({
      where: {
        userId: req.user?.id,
        OR: [
          { name: { contains: keyword as string, mode: 'insensitive' } },
          { description: { contains: keyword as string, mode: 'insensitive' } },
        ],
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      include: {
        likes: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        userId: req.user?.id,
        OR: [
          { name: { contains: keyword as string, mode: 'insensitive' } },
          { description: { contains: keyword as string, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

// 유저의 좋아요 상품 목록 조회
export const getUserFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  try {
    const products: Product[] = await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId: req.user?.id,
          },
        },
        OR: [
          { name: { contains: keyword as string, mode: 'insensitive' } },
          { description: { contains: keyword as string, mode: 'insensitive' } },
        ],
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      include: {
        likes: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        likes: {
          some: {
            userId: req.user?.id,
          },
        },
        OR: [
          { name: { contains: keyword as string, mode: 'insensitive' } },
          { description: { contains: keyword as string, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

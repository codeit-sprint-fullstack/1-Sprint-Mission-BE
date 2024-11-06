import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 상품 좋아요 추가
export const likeProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  try {
    const like = await prisma.like.create({
      data: {
        productId: Number(productId),
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    next(error);
  }
};

// 상품 좋아요 취소
export const unlikeProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        productId: Number(productId),
        userId: req.user?.id as number,
      },
    });
    res.status(200).json({ message: "좋아요가 취소되었습니다." });
  } catch (error) {
    next(error);
  }
};

// 게시글 좋아요 추가
export const likeArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { articleId } = req.params;

  try {
    const like = await prisma.like.create({
      data: {
        articleId: Number(articleId),
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    next(error);
  }
};

// 게시글 좋아요 취소
export const unlikeArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { articleId } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        articleId: Number(articleId),
        userId: req.user?.id as number,
      },
    });
    res.status(200).json({ message: "좋아요가 취소되었습니다." });
  } catch (error) {
    next(error);
  }
};

import { expressjwt } from 'express-jwt';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { CustomError_Class } from '../utils/error';

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET as string;

const verifyAccessToken = expressjwt({
  secret,
  algorithms: ['HS256'],
}) as unknown as (req: Request, res: Response, next: NextFunction) => void;

const verifyRefreshToken = expressjwt({
  secret: secret,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
}) as unknown as (req: Request, res: Response, next: NextFunction) => void;

const verifyFleaMarketAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id: fleaMarketId } = req.params;

  try {
    const fleaMarketArticle = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(fleaMarketId),
      },
    });

    if (!fleaMarketArticle) {
      const error = new Error('중고게시글이 없습니다.');

      if (error instanceof CustomError_Class) {
        error.code = 404;
        error.status = 404;
        throw error;
      }
    }

    if (fleaMarketArticle?.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      if (error instanceof CustomError_Class) {
        error.code = 403;
        error.status = 403;
        throw error;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyFreeBoardAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: freeBoardId } = req.params;

  try {
    const freeBoardArticle = await prisma.freeBoard.findUnique({
      where: {
        id: Number(freeBoardId),
      },
    });

    if (!freeBoardArticle) {
      const error = new Error('자유게시판에 글이 없습니다.');

      if (error instanceof CustomError_Class) {
        error.code = 404;
        error.status = 404;
        throw error;
      }
    }

    if (freeBoardArticle?.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      if (error instanceof CustomError_Class) {
        error.code = 403;
        error.status = 403;
        throw error;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyCommentAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      const error = new Error('댓글이 없습니다.');

      if (error instanceof CustomError_Class) {
        error.code = 404;
        error.status = 404;
        throw error;
      }
    }

    if (comment?.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      if (error instanceof CustomError_Class) {
        error.code = 403;
        error.status = 403;
        throw error;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyFleaMarketAuth,
  verifyCommentAuth,
  verifyFreeBoardAuth,
};

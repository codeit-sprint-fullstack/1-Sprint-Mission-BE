import { expressjwt } from 'express-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//로그인 한 유저만 좋아요, 게시물 등록, 조회 가능하게끔
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

//리프레시 토큰으로 엑세스토큰 발급
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

//본인의 게시물만 수정 및 삭제 할 수 있게 하기
const verifyFleaMarketAuth = async (req, res, next) => {
  const { id: fleaMarketId } = req.params;

  try {
    const fleaMarketArticle = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(fleaMarketId),
      },
    });

    if (!fleaMarketArticle) {
      const error = new Error('중고게시글이 없습니다.');
      error.code = 404;
      error.status = 404; // HTTP 상태 코드
      throw error;
    }

    if (fleaMarketArticle.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      error.code = 403;
      error.status = 403; // HTTP 상태 코드
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyFreeBoardAuth = async (req, res, next) => {
  const { id: freeBoardId } = req.params;

  try {
    const freeBoardArticle = await prisma.freeBoard.findUnique({
      where: {
        id: Number(freeBoardId),
      },
    });

    if (!freeBoardArticle) {
      const error = new Error('자유게시판에 글이 없습니다.');
      error.code = 404;
      error.status = 404; // HTTP 상태 코드
      throw error;
    }

    if (freeBoardArticle.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      error.code = 403;
      error.status = 403; // HTTP 상태 코드
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyCommentAuth = async (req, res, next) => {
  const { id: commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      const error = new Error('댓글이 없습니다.');
      error.code = 404;
      error.status = 404; // HTTP 상태 코드
      throw error;
    }

    if (comment.userId !== req.auth.userId) {
      const error = new Error('권한이 없습니다.');
      error.code = 403;
      error.status = 403; // HTTP 상태 코드
      throw error;
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

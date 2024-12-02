import { expressjwt } from 'express-jwt';
import { PrismaClient } from '@prisma/client';
import { CustomError_Class } from '../utils/error.js';
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;
const verifyAccessToken = expressjwt({
    secret,
    algorithms: ['HS256'],
});
const verifyRefreshToken = expressjwt({
    secret: secret,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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

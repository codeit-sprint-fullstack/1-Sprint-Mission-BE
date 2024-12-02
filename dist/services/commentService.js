import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getComments = async ({ cursor = '', limit = '5', articleId, articleCategory, }) => {
    if (!articleId) {
        throw new Error('articleId is required'); // articleId가 없으면 에러를 던집니다.
    }
    const commentData = getCommentData(articleCategory, articleId);
    const numericLimit = limit ? Number(limit) : 5;
    const cursorValue = cursor ? Number(cursor) : null;
    const comments = await prisma.comment.findMany({
        take: numericLimit,
        ...(cursorValue && { cursor: { id: cursorValue } }),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        where: {
            ...commentData,
        },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
        },
    });
    const totalCount = await prisma.comment.count({
        where: {
            ...commentData,
        },
    });
    return { totalCount, comments };
};
export const postComment = async ({ articleId, articleCategory, content, userId, }) => {
    if (!articleId) {
        throw new Error('articleId is required'); // articleId가 없으면 에러를 던집니다.
    }
    const commentData = getCommentData(articleCategory, articleId);
    const comments = await prisma.comment.create({
        data: {
            content: content,
            userId: userId,
            ...commentData,
        },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
        },
    });
    return comments;
};
export const editComment = async (id, content) => {
    const comments = await prisma.comment.update({
        where: {
            id: Number(id),
        },
        data: {
            content: content,
        },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
        },
    });
    return comments;
};
export const deleteComment = async (id) => {
    await prisma.comment.delete({
        where: {
            id: Number(id),
        },
    });
};
const getCommentData = (articleCategory, articleId) => {
    if (articleCategory === 'fleamarket') {
        return { fleaMarketId: Number(articleId) };
    }
    else {
        return { freeBoardId: Number(articleId) };
    }
};

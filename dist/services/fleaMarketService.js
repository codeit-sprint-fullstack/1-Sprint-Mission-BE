import { PrismaClient } from '@prisma/client';
import { createError } from '../utils/error.js';
const prisma = new PrismaClient();
export const getFleaMarket = async ({ page, limit, keyword, sort, userId, }) => {
    const offset = (page - 1) * limit;
    let orderBy;
    if (sort === 'recent') {
        orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
    }
    else {
        orderBy = [
            { favoriteCount: 'desc' },
            { createdAt: 'desc' },
            { id: 'desc' },
        ];
    }
    const articles = await prisma.fleaMarket.findMany({
        where: {
            ...(keyword
                ? {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { content: { contains: keyword, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
            comment: {
                select: {
                    id: true,
                },
            },
            favorite: true,
        },
        orderBy,
        skip: offset,
        take: Number(limit),
    });
    const articlesWithIsLiked = articles.map((article) => {
        const isLiked = userId
            ? article.favorite?.some((fav) => fav.userId === userId) ?? false
            : false;
        return {
            ...article,
            isLiked,
        };
    });
    const total = await prisma.fleaMarket.count({
        where: {
            ...(keyword
                ? {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { content: { contains: keyword, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
    });
    return {
        total,
        totalPages: Math.ceil(total / limit),
        data: articlesWithIsLiked,
    };
};
export const getFleaMarketDetail = async (id, userId) => {
    const article = await prisma.fleaMarket.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            user: {
                select: {
                    nickname: true,
                    image: true,
                },
            },
            favorite: {
                select: {
                    userId: true,
                },
            },
        },
    });
    const isLiked = userId
        ? article?.favorite.some((fav) => fav.userId === userId)
        : false;
    if (!article) {
        createError('게시물이 존재하지 않습니다', 404, 404);
    }
    return { article, isLiked };
};
export const deleteFleaMarket = async (id) => {
    await prisma.fleaMarket.delete({
        where: {
            id: Number(id),
        },
    });
};
export const postFleaMarket = async ({ title, content, price, tags, userId, req, }) => {
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];
    const tagsArray = tags ? tags.split(',') : [];
    const article = await prisma.fleaMarket.create({
        data: {
            title: title,
            content: content,
            price: Number(price),
            tags: tagsArray,
            images: imagePaths,
            userId: userId,
        },
    });
    return article;
};
export const editFleaMarket = async ({ title, content, price, tags, id, req, }) => {
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];
    const tagsArray = tags ? tags.split(',') : [];
    const article = await prisma.fleaMarket.update({
        where: { id: Number(id) },
        data: {
            title: title,
            content: content,
            price: Number(price),
            tags: tagsArray,
            images: imagePaths,
        },
    });
    return article;
};

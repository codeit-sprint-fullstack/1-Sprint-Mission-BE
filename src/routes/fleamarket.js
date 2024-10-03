import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import validateProductFields from '../middlewares/validateProductFields.js';
import { CreateArticle, PatchArticle } from './struct.js';
import upload from '../middlewares/multer.middleware.js';
import { number } from 'superstruct';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
    const { userId } = req.body;

    const offset = (page - 1) * limit;

    let orderBy;
    if (sort === 'recent') {
      orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
    } else {
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
        user: true,
        comment: true,
        favorite: true,
      },
      orderBy,
      skip: offset,
      take: Number(limit),
    });

    const articlesWithIsLiked = articles.map((article) => {
      const isLiked = userId
        ? article.favorite.some((fav) => fav.userId === userId)
        : false;
      return {
        ...article,
        isLiked, // isLiked 필드 추가
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

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      data: articlesWithIsLiked,
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const article = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        favorite: true,
      },
    });

    const isLiked = userId
      ? article.favorite.some((fav) => fav.userId === userId)
      : false;

    if (!article) {
      return res.status(404).json({ message: '게시물이 없습니다' });
    }

    res.status(200).json({ article, isLiked });
  })
);

router.post(
  '/post',
  upload.array('images', 3),
  validateProductFields,

  asyncHandler(async (req, res) => {
    const { price, title, content, tags, userId } = req.body;

    const imagePaths = req.files ? req.files.map((file) => file.path) : [];
    const tagsArray = tags ? tags.split(',') : [];

    const article = await prisma.fleaMarket.create({
      data: {
        title,
        content,
        price: Number(price),
        tags: tagsArray,
        images: imagePaths,
        userId: userId,
      },
    });

    res.status(201).json(article);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.fleaMarket.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(201).json(article);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.fleaMarket.delete({
      where: {
        id: Number(id),
      },
    });
    res.sendStatus(204);
  })
);

export default router;

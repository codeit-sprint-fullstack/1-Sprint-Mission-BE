import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import validateProductFields from '../middlewares/validateProductFields.js';
import { CreateArticle, PatchArticle } from './struct.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;

    const offset = (page - 1) * limit;

    let orderBy;
    if (sort === 'recent') {
      orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
    } else {
      orderBy = [
        { favorite: { _count: 'desc' } },
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
      take: Number(10),
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
      data: articles,
    });
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

// router.post(
//   '/post',
//   validateProductFields,
//   asyncHandler(async (req, res) => {
//     const { price } = req.body;
//     const article = await prisma.fleaMarket.create({
//       data: {
//         ...req.body,
//         price: Number(price),
//       },
//     });
//     res.status(201).json(article);
//   })
// );

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        favorite: true,
      },
    });

    res.status(200).json(article);
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

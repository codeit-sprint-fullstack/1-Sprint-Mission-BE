import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';

const router = express.Router();
const prisma = new PrismaClient();

// router.get(
//   '/:category/:articleId',
//   asyncHandler(async (req, res) => {
//     const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;

//     const offset = (page - 1) * limit;

//     let orderBy;
//     if (sort === 'recent') {
//       orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
//     } else {
//       orderBy = [{ createdAt: 'asc' }, { id: 'desc' }];
//     }

//     const articles = await prisma.fleaMarket.findMany({
//       where: {
//         ...(keyword
//           ? {
//               OR: [
//                 { title: { contains: keyword, mode: 'insensitive' } },
//                 { content: { contains: keyword, mode: 'insensitive' } },
//               ],
//             }
//           : {}),
//       },
//       include: {
//         user: true,
//         comment: true,
//       },
//       orderBy,
//       skip: offset,
//       take: parseInt(limit, 10),
//     });

//     const total = await prisma.fleaMarket.count({
//       where: {
//         ...(keyword
//           ? {
//               OR: [
//                 { title: { contains: keyword, mode: 'insensitive' } },
//                 { content: { contains: keyword, mode: 'insensitive' } },
//               ],
//             }
//           : {}),
//       },
//     });

//     res.status(200).json({
//       total,
//       totalPages: Math.ceil(total / limit),
//       data: articles,
//     });
//   })
// );

router.post(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { articleCategory, articleId } = req.params;

    let favorites;

    if (articleCategory === 'freeboard') {
      favorites = await prisma.favorite.create({
        data: {
          userId: req.body.userId,
          freeBoardId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    } else if (articleCategory === 'fleamarket') {
      favorites = await prisma.favorite.create({
        data: {
          userId: req.body.userId,
          fleaMarketId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    }
    res.status(201).json(favorites);
  })
);

router.delete(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { articleCategory, articleId } = req.params;
    const { userId } = req.query;

    if (articleCategory === 'freeboard') {
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          freeBoardId: Number(articleId),
        },
      });
    } else if (articleCategory === 'fleamarket') {
      await prisma.favorite.delete({
        where: {
          userId: userId,
          freeBoardId: Number(articleId),
        },
      });
    }

    res.sendStatus(204);
  })
);
// router.get(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const article = await prisma.fleaMarket.findUnique({
//       where: {
//         id: Number(id),
//       },
//       include: {
//         user: true, // 필요에 따라 관련된 사용자 정보도 포함
//       },
//     });

//     res.status(200).json(article);
//   })
// );

// router.patch(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const article = await prisma.fleaMarket.update({
//       where: { id: Number(id) },
//       data: req.body,
//     });
//     res.status(201).json(article);
//   })
// );

export default router;

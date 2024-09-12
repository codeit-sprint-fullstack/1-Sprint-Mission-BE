import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';
import assert from 'assert';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/freeboard',
  asyncHandler(async (req, res) => {
    const { cursor, limit, skip, orderBy, keyword = '' } = req.query;
    const { freeboard } = req.params;

    const LimitValue = limit ? parseInt(limit, 10) : 0;
    const skipValue = skip ? parseInt(skip, 10) : 0;
    const cursorValue = cursor ? parseInt(cursor, 10) : null;

    let orderByClause = 'recent';
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'old':
        orderByClause = { createdAt: 'asc' };
    }

    const queryOptions = {
      take: LimitValue,
      skip: skipValue,
      ...(cursorValue && { cursor: { id: cursorValue } }),
      orderBy: orderByClause,
      where: {
        category: freeboard,
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
      },
    };

    // let categoryClause = '';

    // if (category === 'fleamarket') {
    //   categoryClause = 'fleamarket';
    // } else if (category === 'freeboard') {
    //   categoryClause = 'freeboard';
    // } else {
    //   categoryClause = undefined;
    // }

    const [articles, totalCount] = await prisma.$transaction([
      prisma.article.findMany(queryOptions),
      prisma.article.count({
        where: {
          freeboard: freeboard,
        },
      }),
    ]);
    res.send({ articles, totalCount });
  })
);

// const article = await prisma.article.findMany({
//   where,
//   orderBy: orderByClause,
//   skip: parseInt(offset),
//   take: numericLimit,
//   include: {
//     user: {
//       select: {
//         name: true, // 사용자 이름만 포함
//       },
//     },
//     comment: {
//       include: {
//         user: {
//           select: {
//             name: true, // 댓글 작성자의 사용자 이름만 포함
//           },
//         },
//       },
//     },
//   },
// });

//     res.send(article);
//   })
// );

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id, 10), // 정수형으로 변환 후 사용
      },
      include: {
        user: {
          select: {
            name: true, // 사용자 이름만 포함
          },
        },
        comment: {
          include: {
            user: {
              select: {
                name: true, // 댓글 작성자의 사용자 이름만 포함
              },
            },
          },
        },
      },
    });
    res.send(article);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const article = await prisma.article.update({
      where: {
        id: parseInt(id, 10), // 정수형으로 변환 후 사용
      },
      data: req.body,
    });
    res.send(article);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: {
        id: parseInt(id, 10), // 정수형으로 변환 후 사용
      },
    });
    res.sendStatus(204);
  })
);

export default router;

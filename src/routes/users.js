import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateUser, PatchUser } from './struct.js';
import assert from 'assert';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// 사용자 조회 및 생성 라우트 통합
router
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const users = await prisma.user.findMany({
        include: {
          Favorite: true,
        },
      });
      res.send(users);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateUser);
      const user = await prisma.user.create({
        data: req.body,
      });
      res.status(201).send(user);
    })
  );

// 사용자 ID로 조회, 수정 및 삭제 라우트
router
  .route('/:id')
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await prisma.user.findUniqueOrThrow({
        include: {
          fleaMarket: true,
          freeBoard: true,
          Favorite: true,
        },
        where: { id },
      });
      res.send(user);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchUser);
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id },
        data: req.body,
      });
      res.send(user);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

// 인증된 사용자 정보 조회
router.get(
  '/auth',
  authMiddleware,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  })
);

export default router;

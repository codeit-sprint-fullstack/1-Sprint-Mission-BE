import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateUser, PatchUser } from './struct.js';
import assert from 'assert';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      include: {
        article: {
          select: {
            title: true,
          },
        },
      },
    });
    res.send(users);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUniqueOrThrow({
      include: {
        article: {
          select: {
            title: true,
          },
        },
      },
      where: { id },
    });
    res.send(user);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateUser);
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).send(user);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchUser);
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.send(user);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

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

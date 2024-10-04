import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs.js';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        images: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        favoriteCount: true,
      },
    });
    res.send(product);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
    let orderBy;
    switch (order) {
      case 'old':
        orderBy = { createdAt: 'desc' };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'asc' };
    }
    const product = await prisma.product.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy,
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        images: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        favoriteCount: true,
      },
    });
    res.send(product);
  })
);

// 상품 등록 API //name, description, price, tags를 입력해 게시글을 등록합니다.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });
    res.send(product);
  })
);

// 상품 수정 API
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(product);
  })
);

// 상품 삭제 API
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.send(204);
  })
);

export default router;

import { Router } from "express";
import asyncHandler from "../Common/asyncHandler.js";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });
    res.status(201).json(product);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });

    res.status(200).json({
      total,
      page: parseInt(page),
      pageSize: products.length,
      data: products,
    });
  })
);

// 상품 상세 조회 API
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, tags },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  })
);

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

// 상품 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;
    const sortOption = { createdAt: "desc" };

    const searchQuery = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : {};

    const totalProducts = await prisma.product.count({ where: searchQuery });
    const products = await prisma.product.findMany({
      where: searchQuery,
      orderBy: sortOption,
      skip: offset,
      take: Number(pageSize),
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    res.send({ totalProducts, products });
  })
);
// 상품 상세 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 상품 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newProduct = await prisma.product.create({
      data: req.body,
    });

    res.status(201).send(newProduct);
  })
);
// 상품 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(updatedProduct);
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);
// 상품 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

export default router;

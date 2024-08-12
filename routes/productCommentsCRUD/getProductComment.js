import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  "/:productId",
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor } = req.query;

    const comments = await prisma.productComment.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: "desc" },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
    });

    res.status(200).json(comments);
  })
);

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  "/:mongoProductId/comments",
  asyncHandler(async (req, res) => {
    const { mongoProductId } = req.params;
    const { cursor, take = 10 } = req.query; // cursor와 take를 쿼리 매개변수로 받음

    const comments = await prisma.productComment.findMany({
      where: { productId: mongoProductId },
      orderBy: { createdAt: "desc" },
      take: parseInt(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
    });

    res.status(200).json(comments);
  })
);

export default router;

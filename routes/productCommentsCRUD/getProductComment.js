import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  "/:mongoProductId",
  asyncHandler(async (req, res) => {
    const { mongoProductId } = req.params;
    const { cursor, take = 10 } = req.query;

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

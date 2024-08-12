import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { content } = req.body;

    const comment = await prisma.productComment.create({
      data: {
        content,
        productId: parseInt(productId),
      },
    });
    res.status(201).json(comment);
  })
);

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await prisma.productComment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.status(200).json(comment);
  })
);

export default router;

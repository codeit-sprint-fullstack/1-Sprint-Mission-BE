import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.articleComment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  })
);

export default router;

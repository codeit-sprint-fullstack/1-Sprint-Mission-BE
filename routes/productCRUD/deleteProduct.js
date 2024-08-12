import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

// 상품 삭제 API
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

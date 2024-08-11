import { Router } from "express";
import Product from "../../models/product.js";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

// 상품 삭제 API
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    // 상품 관련 댓글 삭제(postgresql)
    await prisma.productComment.deleteMany({
      where: { productId: req.params.id },
    });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  })
);

export default router;

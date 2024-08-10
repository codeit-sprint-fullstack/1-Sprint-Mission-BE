import { Router } from "express";
import Product from "../models/product.js";
import { PrismaClient } from "@prisma/client"; // 'PrismaClient'를 사용하여 Prisma ORM을 가져옴

const prisma = new PrismaClient();
const router = Router();

// 상품 삭제 API
router.delete("/:id", async (req, res) => {
  try {
    // MongoDB에서 상품 삭제
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // PostgreSQL에서 연관된 댓글 삭제
    await prisma.productComment.deleteMany({
      where: { productId: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product or comments:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;

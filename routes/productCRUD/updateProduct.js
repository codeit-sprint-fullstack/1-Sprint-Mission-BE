import { Router } from "express";
import Product from "../../models/product.js";
import asyncHandler from "../asyncHandler.js";

const router = Router();

// 상품 수정 API
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, tags, updatedAt: Date.now() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  })
);

export default router;

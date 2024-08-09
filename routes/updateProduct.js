import { Router } from "express";
import Product from "../models/product.js";
const router = Router();

// 상품 수정 API
router.patch("/:_id", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await Product.findOneAndUpdate(
      req.params._id,
      { name, description, price, tags, updatedAt: Date.now() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

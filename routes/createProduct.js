import { Router } from "express";
import Product from "../models/product.js";
const router = Router();

// 상품 등록 API
router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price || !tags) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const id = await getNextSequenceValue("productId");
    const product = new Product({
      name,
      description,
      price,
      tags,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;

import { Router } from "express";
import Product from "../../models/product.js"; // Mongoose 모델 import

const router = Router();

// 상품 목록 조회 API
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ],
    };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pageSize: products.length,
      products,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 상세 조회 API
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

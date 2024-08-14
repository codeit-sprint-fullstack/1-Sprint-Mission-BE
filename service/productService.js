import { Router } from "express";
import Product from "../models/product.js";
import asyncHandler from "../routes/asyncHandler.js";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price || !tags) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const product = new Product({
      name,
      description,
      price,
      tags,
    });
    await product.save();
    res.status(201).json(product);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

// 상품 상세 조회 API
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    // 경로 변수 `:id`로 수정
    try {
      const { name, description, price, tags } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id, // `req.params.id`로 수정
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
  })
);

export default router;

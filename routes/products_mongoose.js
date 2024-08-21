import express from "express";
import Product from "../models/Product_mongoose.js";

const router = express.Router();

// 상품 등록
router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    // 필수 필드 검사
    if (!name || !description || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, description, and price are required." });
    }

    const newProduct = new Product({ name, description, price, tags });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error. Could not register product." });
  }
});

// 상품 목록 조회 (페이지네이션 포함)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, search = "", sort = "recent" } = req.query;

  try {
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const products = await Product.find(query)
      .sort({ createdAt: sort === "recent" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error. Could not fetch products." });
  }
});

// 상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    res
      .status(500)
      .json({ message: "Server error. Could not fetch product details." });
  }
});

// 상품 수정
router.patch("/:id", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    // 필수 필드 검사
    if (!name || !description || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, description, and price are required." });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, tags, updatedAt: Date.now() },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    res
      .status(500)
      .json({ message: "Server error. Could not update product." });
  }
});

// 상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    res
      .status(500)
      .json({ message: "Server error. Could not delete product." });
  }
});

export default router;

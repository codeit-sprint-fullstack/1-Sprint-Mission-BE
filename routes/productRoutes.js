import express from "express";
import { body, validationResult } from "express-validator";
import product from "../models/product.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// 상품 목록 조회
router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const {
      order = "descending",
      pageSize = 10,
      page = 1,
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      date = "",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const searchRegex = new RegExp(keyword, "i");
    const dateFilter = date ? { createdAt: { $gt: new Date(date) } } : {};
    const sortOrder = order === "ascending" ? 1 : -1;

    const [products, totalCount] = await Promise.all([
      product
        .find({
          $or: [{ name: searchRegex }, { description: searchRegex }],
          price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
          ...dateFilter,
        })
        .sort({ createdAt: sortOrder })
        .skip(offset)
        .limit(parseInt(pageSize)),
      product.countDocuments({
        $or: [{ name: searchRegex }, { description: searchRegex }],
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        ...dateFilter,
      }),
    ]);

    res.json({ list: products, totalCount });
  })
);

// 상품 상세 조회
router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

// 상품 등록
router.post(
  "/products",
  [
    body("name").notEmpty().withMessage("상품명은 필수필드 입니다."),
    body("price").isNumeric().withMessage("가격은 숫자여야 합니다."),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수입니다."),
    body("tags").optional().isArray().withMessage("태그는 배열이어야 합니다."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  })
);

// 상품 수정
router.patch(
  "/products/:id",
  [
    body("name").optional().notEmpty().withMessage("상품명은 필수필드 입니다."),
    body("price").optional().isNumeric().withMessage("가격은 숫자여야 합니다."),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수입니다."),
    body("tags").optional().isArray().withMessage("태그는 배열이어야 합니다."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

// 상품 삭제
router.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

export default router;

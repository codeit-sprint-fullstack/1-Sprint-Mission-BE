import express from "express";
import Product from "../models/product.js";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();

// 상품 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;
    const sort = "recent"; // 최신순만 구현
    const sortOption = { createdAt: sort === "recent" ? "desc" : "asc" };

    const searchQuery = keyword
      ? {
          $or: [
            { name: { $regex: keyword } },
            { description: { $regex: keyword } },
          ],
        }
      : {};

    const totalProducts = await Product.countDocuments(searchQuery);
    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .skip(offset)
      .limit(Number(pageSize))
      .select("id name description price createdAt");

    const result = await res.send({ totalProducts, products });
  })
);
// 상품 상세 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 상품 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);

    res.status(201).send(newProduct);
  })
);
// 상품 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 상품 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);

export default router;

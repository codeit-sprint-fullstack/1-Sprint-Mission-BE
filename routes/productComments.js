import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const baseUrl = "https://thrift-shop.onrender.com/products";

// 상품 댓글 등록 API
router.post("/products/:mongoProductId/comments", async (req, res) => {
  try {
    const { mongoProductId } = req.params;
    const { content } = req.body;

    // MongoDB에서 상품 정보 가져오기
    const response = await axios.get(`${baseUrl}/${mongoProductId}`);
    const product = response.data;

    if (!product) {
      return res.status(404).json({ error: "Product not found in MongoDB" });
    }

    // PostgreSQL에 상품 댓글 저장
    const productComment = await prisma.productComment.create({
      data: {
        content,
        productId: mongoProductId, // MongoDB 상품 ID 저장
      },
    });

    res.status(201).json(productComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 상품 댓글 목록 조회 API
router.get("/products/:mongoProductId/comments", async (req, res) => {
  try {
    const { mongoProductId } = req.params;

    // PostgreSQL에서 상품 ID로 댓글 조회
    const comments = await prisma.productComment.findMany({
      where: { productId: mongoProductId },
      orderBy: { createdAt: "desc" }, // 최신순 정렬
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

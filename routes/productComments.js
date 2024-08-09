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

// 댓글 수정
router.patch("/products/:mongoProductId/comments/:id", async (req, res) => {
  try {
    const { mongoProductId, id } = req.params;
    const { content } = req.body;

    const comment = await prisma.productComment.findFirst({
      where: {
        id: parseInt(id),
        productId: mongoProductId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const updatedComment = await prisma.productComment.update({
      where: { id: comment.id },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/products/:mongoProductId/comments/:id", async (req, res) => {
  try {
    const { mongoProductId, id } = req.params;

    // `mongoProductId`와 `id`가 일치하는 댓글을 찾습니다.
    const comment = await prisma.productComment.findFirst({
      where: {
        id: parseInt(id),
        productId: mongoProductId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // 댓글을 삭제합니다.
    await prisma.productComment.delete({
      where: { id: comment.id }, // 일치하는 `id`로 삭제
    });

    res.status(204).end(); // No Content 응답
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

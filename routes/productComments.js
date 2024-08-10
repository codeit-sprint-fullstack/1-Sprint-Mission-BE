import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const baseUrl = "https://thrift-shop.onrender.com/products";

// 상품 댓글 등록 API
router.post("/:mongoProductId/comments", async (req, res) => {
  try {
    const { mongoProductId } = req.params;
    const { content } = req.body;

    const response = await axios.get(`${baseUrl}/${mongoProductId}`);
    const product = response.data;

    if (!product) {
      return res.status(404).json({ error: "Product not found in MongoDB" });
    }

    const productComment = await prisma.productComment.create({
      data: {
        content,
        productId: mongoProductId,
      },
    });

    res.status(201).json(productComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 상품 댓글 목록 조회 API
router.get("/:mongoProductId/comments", async (req, res) => {
  try {
    const { mongoProductId } = req.params;

    const comments = await prisma.productComment.findMany({
      where: { productId: mongoProductId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 댓글 수정
router.patch("/:mongoProductId/comments/:id", async (req, res) => {
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

// 댓글 삭제
router.delete("/:mongoProductId/comments/:id", async (req, res) => {
  try {
    const { mongoProductId, id } = req.params;

    const comment = await prisma.productComment.findFirst({
      where: {
        id: parseInt(id),
        productId: mongoProductId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await prisma.productComment.delete({
      where: { id: comment.id },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

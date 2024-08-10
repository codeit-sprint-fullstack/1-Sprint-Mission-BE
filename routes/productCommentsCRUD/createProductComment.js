import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const baseUrl = "https://thrift-shop.onrender.com/products";

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

export default router;

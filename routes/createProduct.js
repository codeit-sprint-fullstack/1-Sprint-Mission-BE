import { Router } from "express";
import Product from "../models/product.js";
import { getNextSequenceValue } from "../models/sequence.js";
const router = Router();

// 상품 등록 API
router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body); // 요청 본문 로그 추가
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price || !tags) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const id = await getNextSequenceValue("productId"); // 시퀀스에서 다음 ID 가져오기
    const product = new Product({
      _id: id.toString(), // 수정: id를 문자열로 변환
      name,
      description,
      price,
      tags,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving product:", error); // 에러 로그 추가
    res.status(400).json({ error: error.message });
  }
});

export default router;

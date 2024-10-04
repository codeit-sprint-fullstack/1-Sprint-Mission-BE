const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// 상품 등록 - 로그인한 사용자만 가능
router.post("/", authMiddleware, createProduct);

// 모든 상품 목록 조회
router.get("/", getProducts);

// 특정 상품 조회
router.get("/:productId", getProductById);

// 상품 수정 - 로그인한 사용자만 가능
router.patch("/:productId", authMiddleware, updateProduct);

// 상품 삭제 - 로그인한 사용자만 가능
router.delete("/:productId", authMiddleware, deleteProduct);

module.exports = router;


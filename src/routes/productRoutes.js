const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

// 상품 등록
router.post("/", authMiddleware, productController.createProduct);

// 상품 목록 조회
router.get("/", productController.getProducts);

// 상품 상세 조회
router.get("/:productId", productController.getProductById);

// 상품 수정
router.patch("/:productId", authMiddleware, productController.updateProduct);

// 상품 삭제
router.delete("/:productId", authMiddleware, productController.deleteProduct);

// 상품 좋아요
router.post(
  "/:productId/favorite",
  authMiddleware,
  productController.addFavorite
);

// 상품 좋아요 취소
router.delete(
  "/:productId/favorite",
  authMiddleware,
  productController.removeFavorite
);

module.exports = router;

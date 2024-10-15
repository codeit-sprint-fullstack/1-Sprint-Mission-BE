import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleFavorite,
} from "../../controllers/productController.js"; // 컨트롤러에서 함수 가져오기
import authMiddleware from "../../middlewares/authMiddleware.js"; // JWT 토큰 인증 미들웨어 import
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import { validateProduct } from "../../middlewares/productValidationMiddleware.js"; // 유효성 검사 미들웨어 import
import { uploadImageMiddleware } from "../../middlewares/upload.js"; // 업로드 미들웨어 가져오기

const router = express.Router();

// 상품 목록 조회 및 등록 API
router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, uploadImageMiddleware, validateProduct, createProduct);

// 상품 상세 조회 API
router.get("/:id", getProductById);

// 상품 수정 API
router.patch("/:id", authMiddleware, uploadImageMiddleware, updateProduct);

// 상품 삭제 API
router.delete("/:id", authMiddleware, deleteProduct);

// 상품에 좋아요(찜) 추가 및 삭제 API
router.post("/:id/favorite", authMiddleware, toggleFavorite);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

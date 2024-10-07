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
import multer from "multer"; // 파일 업로드를 처리하기 위한 미들웨어
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import { validateProduct } from "../../middlewares/productValidationMiddleware.js"; // 유효성 검사 미들웨어 import

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일을 저장할 경로
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // 안전한 파일 이름으로 변경
    cb(null, Date.now() + "-" + sanitizedFileName); // 수정된 파일 이름 사용
  },
});

const upload = multer({ storage });

// 상품 목록 조회 및 등록 API
router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, upload.array("images"), validateProduct, createProduct);

// 상품 상세 조회 API
router.get("/:id", getProductById);

// 상품 수정 API
router.patch("/:id", authMiddleware, upload.array("images"), updateProduct);

// 상품 삭제 API
router.delete("/:id", authMiddleware, deleteProduct);

// 상품에 좋아요(찜) 추가 및 삭제 API
router.post("/:id/favorite", authMiddleware, toggleFavorite);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

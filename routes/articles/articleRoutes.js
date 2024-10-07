import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../controllers/articleController.js"; // 컨트롤러에서 함수 가져오기
import { validateArticle } from "../../middlewares/ArticleValidation.js"; // 유효성 검사 미들웨어 import
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import { uploadImageMiddleware } from "../../middlewares/upload.js";

const router = express.Router(); // API 경로 정의

// 게시글 목록 조회 API
router.get("/", getArticles);

// 게시글 상세 조회 API
router.get("/:id", getArticleById);

// 게시글 등록 API
router.post("/", validateArticle, uploadImageMiddleware, createArticle); // 유효성 검사 미들웨어 추가

// 게시글 수정 API
router.patch("/:id", uploadImageMiddleware, updateArticle);

// 게시글 삭제 API
router.delete("/:id", deleteArticle);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

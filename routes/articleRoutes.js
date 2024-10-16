import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  listArticles,
} from "../controllers/articleController.js";

const router = express.Router();

// 게시글 등록
router.post("/", asyncHandler(createArticle));

// 게시글 조회
router.get("/:id", asyncHandler(getArticle));

// 게시글 수정
router.patch("/:id", asyncHandler(updateArticle));

// 게시글 삭제
router.delete("/:id", asyncHandler(deleteArticle));

// 게시글 목록 조회
router.get("/", asyncHandler(listArticles));

export default router;

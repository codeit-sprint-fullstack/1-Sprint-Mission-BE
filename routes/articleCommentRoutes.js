import express from "express";
import {
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
  listArticleComments,
} from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// 게시글의 댓글 등록
router.post("/", asyncHandler(createArticleComment));

// 게시글의 댓글 수정
router.patch("/:id", asyncHandler(updateArticleComment));

// 게시글의 댓글 삭제
router.delete("/:id", asyncHandler(deleteArticleComment));

// 특정 게시글의 댓글 조회
router.get("/:articleId", asyncHandler(listArticleComments));

export default router;

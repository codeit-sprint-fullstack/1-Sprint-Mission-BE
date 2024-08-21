import express from "express";
import {
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
  listArticleComments,
} from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router({ mergeParams: true });

// 게시글에 댓글 등록
router.post("/", asyncHandler(createArticleComment));

// 댓글 수정
router.patch("/:commentId", asyncHandler(updateArticleComment));

// 댓글 삭제
router.delete("/:commentId", asyncHandler(deleteArticleComment));

// 특정게시글 모든 댓글 조회
router.get("/", asyncHandler(listArticleComments));

export default router;

// src/routes/commentRoutes.js
import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  listComments,
} from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// 댓글 달기
router.post("/", asyncHandler(createComment));

// 댓글 수정
router.patch("/:id", asyncHandler(updateComment));

// 댓글 지우기
router.delete("/:id", asyncHandler(deleteComment));

// 댓글 조회
router.get("/", asyncHandler(listComments));

export default router;

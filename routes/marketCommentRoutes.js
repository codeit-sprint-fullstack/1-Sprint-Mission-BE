// src/routes/marketCommentRoutes.js
import express from "express";
import {
  createMarketComment,
  updateMarketComment,
  deleteMarketComment,
  listMarketComments,
} from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// 중고템 댓글 작성
router.post("/", asyncHandler(createMarketComment));

// 중고템 댓글 수정
router.patch("/:id", asyncHandler(updateMarketComment));

// 중고템 댓글 삭제
router.delete("/:id", asyncHandler(deleteMarketComment));

// 중고템 댓글 조회
router.get("/", asyncHandler(listMarketComments));

export default router;

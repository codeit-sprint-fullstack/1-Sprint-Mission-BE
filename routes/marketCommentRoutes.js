import express from "express";
import {
  createMarketComment,
  updateMarketComment,
  deleteMarketComment,
  listMarketComments,
} from "../controllers/commentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router({ mergeParams: true });

// 중고템 댓글 작성
router.post("/", asyncHandler(createMarketComment));

// 댓글 수정
router.patch("/:commentId", asyncHandler(updateMarketComment));

// 댓글 삭제
router.delete("/:commentId", asyncHandler(deleteMarketComment));

// 특정중고템 모든 댓글 조회
router.get("/", asyncHandler(listMarketComments));

export default router;

import express from "express";
import {
  createMarketItem,
  getMarketItem,
  updateMarketItem,
  deleteMarketItem,
  listMarketItems,
} from "../controllers/marketItemController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// 중고템 등록
router.post("/", asyncHandler(createMarketItem));

// 중고템 조회
router.get("/:id", asyncHandler(getMarketItem));

// 중고템 수정
router.patch("/:id", asyncHandler(updateMarketItem));

// 중고템 삭제
router.delete("/:id", asyncHandler(deleteMarketItem));

// 중고템 목록 조회
router.get("/", asyncHandler(listMarketItems));

export default router;

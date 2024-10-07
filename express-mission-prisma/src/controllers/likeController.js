import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  attachUserId,
  verifyAccessToken,
} from "../middlewares/authorizationMiddleware.js";
import validateData from "../middlewares/validateData.js";
import likeService from "../services/likeService.js";

const articleLikeController = express.Router();
const productLikeController = express.Router();

articleLikeController.route("/:id/like").post(
  verifyAccessToken,
  validateData.like("article"),
  attachUserId,
  asyncHandler(async (req, res, next) => {
    const like = await likeService.create(req.body);
    res.status(201).send(like);
  })
);

// 같은 유저로 중복 좋아요 방지하는 코드 추가 작성 필요
// 현재 기본 일반 API 처럼 만들고 있는중

export { articleLikeController };

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
    const isDuplicate = await likeService.getByFillter(req.body, "article");
    if (!isDuplicate) {
      const [like, likeCount, user, article] =
        await likeService.fetchArticleAndRelatedData(req.body);

      const resData = {
        updatedAt: like.updatedAt,
        createdAt: like.createdAt,
        likeCount: likeCount,
        writer: {
          nickname: user.nickname,
          id: user.id,
        },
        content: article.content,
        title: article.title,
        id: article.id,
        isLiked: true,
      };

      res.status(201).send(resData);
    } else if (isDuplicate) {
      const error = new Error("Duplicate entry: like already exists");
      error.code = 409;
      throw error;
    }
  })
);

export { articleLikeController };

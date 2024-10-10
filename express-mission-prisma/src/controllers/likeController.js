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

articleLikeController
  .route("/:id/like")
  .post(
    verifyAccessToken,
    validateData.like("article"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const isDuplicate = await likeService.getByFillter(req.body, "article");
      if (!isDuplicate) {
        const [like, likeCount, user, article] =
          await likeService.createArticleAndRelatedData(req.body);

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
  )
  .delete(
    verifyAccessToken,
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      req.body.articleId = id;

      const isDuplicate = await likeService.getByFillter(req.body, "article");
      if (isDuplicate) {
        req.body.likeId = isDuplicate.id;
        const [like, likeCount, user, article] =
          await likeService.deleteArticleAndRelatedData(req.body);

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
          isLiked: false,
        };

        res.status(200).send(resData);
      } else if (!isDuplicate) {
        const error = new Error(
          "No like found for the specified userId and articleId."
        );
        error.code = 404;
        throw error;
      }
    })
  );

productLikeController
  .route("/:id/favorite")
  .post(
    verifyAccessToken,
    validateData.like("product"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const isDuplicate = await likeService.getByFillter(req.body, "product");
      if (!isDuplicate) {
        const [like, likeCount, user, product] =
          await likeService.createProductAndRelatedData(req.body);

        const resData = {
          createdAt: like.createdAt,
          favoriteCount: likeCount,
          ownerNickname: user.nickname,
          ownerId: user.id,
          images: product.image,
          tags: product.tags,
          price: product.price,
          description: product.description,
          name: product.name,
          id: product.id,
          isLiked: true,
        };

        res.status(201).send(resData);
      } else if (isDuplicate) {
        const error = new Error("Duplicate entry: like already exists");
        error.code = 409;
        throw error;
      }
    })
  )
  .delete(
    verifyAccessToken,
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      req.body.productId = id;

      const isDuplicate = await likeService.getByFillter(req.body, "product");
      if (isDuplicate) {
        req.body.likeId = isDuplicate.id;
        const [like, likeCount, user, product] =
          await likeService.deleteProductAndRelatedData(req.body);

        const resData = {
          createdAt: like.createdAt,
          favoriteCount: likeCount,
          ownerNickname: user.nickname,
          ownerId: user.id,
          images: product.image,
          tags: product.tags,
          price: product.price,
          description: product.description,
          name: product.name,
          id: product.id,
          isLiked: false,
        };

        res.status(200).send(resData);
      } else if (!isDuplicate) {
        const error = new Error(
          "No like found for the specified userId and productId."
        );
        error.code = 404;
        throw error;
      }
    })
  );

export { articleLikeController, productLikeController };

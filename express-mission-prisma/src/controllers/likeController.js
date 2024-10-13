import express from "express";
import {
  attachUserId,
  verifyAccessToken,
} from "../middlewares/authorizationMiddleware.js";
import validateData from "../middlewares/validateData.js";
import likeService from "../services/likeService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createArticleLikeResponse,
  createProductLikeResponse,
} from "../utils/like/createLikeResponse.js";

const articleLikeController = express.Router();
const productLikeController = express.Router();

articleLikeController
  .route("/:id/like")
  .post(
    verifyAccessToken,
    validateData.like("article"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const isDuplicate = await likeService.getByfilter(req.body, "article");
      if (!isDuplicate) {
        const transactionTasks = await likeService.createArticleAndRelatedData(
          req.body
        );
        const resData = createArticleLikeResponse(transactionTasks, "post");

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

      const isDuplicate = await likeService.getByfilter(req.body, "article");
      if (isDuplicate) {
        req.body.likeId = isDuplicate.id;
        const transactionTasks = await likeService.deleteArticleAndRelatedData(
          req.body
        );
        const resData = createArticleLikeResponse(transactionTasks, "delete");

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
      const isDuplicate = await likeService.getByfilter(req.body, "product");
      if (!isDuplicate) {
        const transactionTasks = await likeService.createProductAndRelatedData(
          req.body
        );
        const resData = createProductLikeResponse(transactionTasks, "post");

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

      const isDuplicate = await likeService.getByfilter(req.body, "product");
      if (isDuplicate) {
        req.body.likeId = isDuplicate.id;
        const transactionTasks = await likeService.deleteProductAndRelatedData(
          req.body
        );
        const resData = createProductLikeResponse(transactionTasks, "delete");

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

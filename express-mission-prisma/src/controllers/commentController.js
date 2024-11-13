import express from "express";
import {
  attachUserId,
  verifyAccessToken,
  verifyCommentAuth,
} from "../middlewares/authorizationMiddleware.js";
import validateData from "../middlewares/validateData.js";
import commentService from "../services/commentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import createCursorResponse from "../utils/createCursorResponse.js";

const commentController = express.Router(); // 수정 및 삭제를 위한 router
const articleCommentController = express.Router(); // 게시글 댓글 router
const productCommentController = express.Router(); // 상품 댓글 router

articleCommentController
  .route("/:id/comment")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { pageSize } = req.query;
      const freeComment = await commentService.getAllByFilter(
        id,
        req.query,
        "article"
      );
      const count = await commentService.countByFilter(id, "article");
      const [list, total] = await Promise.all([freeComment, count]);

      const currentPageSize = parseInt(pageSize) || 5;
      const resBody = createCursorResponse(list, total, currentPageSize);
      res.send(resBody);
    })
  )
  .post(
    verifyAccessToken,
    validateData.comment("post", "article"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const comment = await commentService.create(req.body);
      res.status(201).send(comment);
    })
  );

productCommentController
  .route("/:id/comment")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { pageSize } = req.query;
      const comment = await commentService.getAllByFilter(
        id,
        req.query,
        "product"
      );
      const count = await commentService.countByFilter(id, "product");
      const [list, total] = await Promise.all([comment, count]);

      const currentPageSize = parseInt(pageSize) || 2;
      const resBody = createCursorResponse(list, total, currentPageSize);
      res.send(resBody);
    })
  )
  .post(
    verifyAccessToken,
    validateData.comment("post", "product"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const comment = await commentService.create(req.body);
      res.status(201).send(comment);
    })
  );

commentController
  .route("/:id")
  .patch(
    verifyAccessToken,
    verifyCommentAuth,
    validateData.comment("patch"),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const comment = await commentService.update(id, req.body);
      res.status(201).send(comment);
    })
  )
  .delete(
    verifyAccessToken,
    verifyCommentAuth,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await commentService.deleteById(id);
      res.sendStatus(204);
    })
  );

export {
  commentController,
  articleCommentController,
  productCommentController,
};

import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import commentService from "../services/commentService.js";
import validateData from "../middlewares/validateData.js";
import {
  attachUserId,
  verifyAccessToken,
  verifyCommentAuth,
} from "../middlewares/authorizationMiddleware.js";

const commentController = express.Router(); // 수정 및 삭제를 위한 router
const articleCommentController = express.Router(); // 게시글 댓글 router
const productCommentController = express.Router(); // 상품 댓글 router

articleCommentController
  .route("/:id/comment")
  .post(
    verifyAccessToken,
    validateData.comment("post", "article"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const comment = await commentService.create(req.body);
      res.status(201).send(comment);
    })
  )
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

      const lastList = list[pageSize || 5];
      const NextCusor = lastList ? lastList.id : "null";
      if (NextCusor !== "null") {
        list.pop();
      }

      res.send({
        cursorInfo: {
          total,
          NextCusor,
        },
        list,
      });
    })
  );

productCommentController
  .route("/:id/comment")
  .post(
    verifyAccessToken,
    validateData.comment("post", "product"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const comment = await commentService.create(req.body);
      res.status(201).send(comment);
    })
  )
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

      const lastList = list[pageSize || 2];
      const NextCusor = lastList ? lastList.id : "null";
      if (NextCusor !== "null") {
        list.pop();
      }

      res.send({
        cursorInfo: {
          total,
          NextCusor,
        },
        list,
      });
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

export { commentController, articleCommentController, productCommentController };

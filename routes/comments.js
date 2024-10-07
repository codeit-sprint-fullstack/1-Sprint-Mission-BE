import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createComment, updateComment } from "../structs/commentStruct.js";
import authUser from "../middlewares/authUser.js";
import commentService from "../service/commentService.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.get(
  "/:id/article",
  asyncHandle(async (req, res, next) => {
    try {
      const comments = await commentService.getArticleComments(req);
      res.status(200).send(comments);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/:id/product",
  asyncHandle(async (req, res, next) => {
    try {
      const comments = await commentService.getProductComments(req);
      res.status(200).send(comments);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/article",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user;
      const { id: articleId } = req.params;
      const data = await commentService.createComment({
        ...req.body,
        articleId,
        userId,
      });
      return res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/product",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user;
      const { id: productId } = req.params;
      const data = await commentService.createComment({
        ...req.body,
        productId,
        userId,
      });
      return res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyCommentAuth, //작성자만 수정/삭제가 가능하다.
  asyncHandle(async (req, res, next) => {
    assert(req.body, updateComment);
    try {
      const { id: commentId } = req.params;
      const { id: userId } = req.user;
      const data = await commentService.updateComment({
        ...req.body,
        commentId,
        userId,
      });

      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyCommentAuth, //작성자만 수정/삭제가 가능하다.
  asyncHandle(async (req, res, next) => {
    try {
      const { id } = req.params;
      await commentService.deleteComment(id);
      return res.status(204).send({ message: "success" });
    } catch (error) {
      next(error);
    }
  })
);

export default router;

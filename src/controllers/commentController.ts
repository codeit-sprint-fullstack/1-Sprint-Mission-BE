import { asyncHandle } from "../utils/errorUtils";
import { assert } from "superstruct";
import { createComment, updateComment } from "../structs/commentStruct";
import authUser from "../middlewares/authUser";
import commentService from "../services/commentService";
import passport from "../config/passportConfig";
import express, { Request, Response, NextFunction } from "express";
import { Comment } from "@prisma/client";
import { CommentData } from "../utils/interfaces/comments/commentData";

const router = express.Router();

router.get(
  "/:id/article",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
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
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
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
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user as { id: string };
      const { id: articleId } = req.params;
      const data = await commentService.createComment({
        ...(req.body as CommentData),
        articleId,
        userId,
      });
      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/product",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user as { id: string };
      const { id: productId } = req.params;
      const data = await commentService.createComment({
        ...(req.body as CommentData),
        productId,
        userId,
      });
      console.log(data);
      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyCommentAuth, //작성자만 수정/삭제가 가능하다.
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, updateComment);
    try {
      const { id } = req.params;
      const data = await commentService.updateComment(
        id,
        req.body as CommentData
      );

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyCommentAuth, //작성자만 수정/삭제가 가능하다.
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await commentService.deleteComment(id);
      res.status(204).send({ message: "success" });
    } catch (error) {
      next(error);
    }
  })
);

export default router;

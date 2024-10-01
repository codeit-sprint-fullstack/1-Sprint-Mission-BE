import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createComment, updateComment } from "../structs/commentStruct.js";
import commentService from "../service/commentService.js";
import passport from "../config/passportConfig.js";

const app = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * paths:
 *  /Comments:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Comments]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 */

app.get(
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

app.get(
  "/:id/product",
  asyncHandle(async (req, res, next) => {
    try {
      const comments = await commentService.getArticleComments(req);
      res.status(200).send(comments);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/:id/article",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user;
      const { id: articleId } = req.params;
      const data = commentService.createComment({
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

app.post(
  "/:id/product",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    assert(req.body, createComment);
    try {
      const { id: userId } = req.user;
      const { id: productId } = req.params;
      const data = commentService.createComment({
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

app.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
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

app.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
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

export default app;

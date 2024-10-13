import express from "express";
import { PrismaClient } from "@prisma/client";

import { validateAccessToken } from "../middlewares/auth.js";
import { validateCommentInput } from "../middlewares/validateInput.js";
import { commentSelect } from "../responses/comment-res.js";
import { SHOW_DEFAULT_COMMENT_COUNT } from "../constants/comment.js";

const prisma = new PrismaClient();
const productCommentRouter = express.Router();

/** POST */
productCommentRouter.post(
  "/:productId/comment",
  validateAccessToken,
  validateCommentInput,
  (req, res, next) => {
    const { productId } = req.params;
    const newComment = { userId: req.id, productId, ...req.body };

    prisma.productComment
      .create({ data: newComment, select: commentSelect })
      .then((data) => {
        return res.status(201).send(data);
      })
      .catch((err) => next(err));
  }
);

/** GET */
productCommentRouter.get(
  "/:productId/comment",
  validateAccessToken,
  (req, res, next) => {
    const { productId } = req.params;
    const { page, pageSize } = req.query;
    const orderBy = { createdAt: "desc" };
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || SHOW_DEFAULT_COMMENT_COUNT;
    const skipInt = (pageNum - 1) * pageSizeNum;

    const commentPromise = prisma.productComment
      .findMany({
        orderBy,
        skip: parseInt(skipInt),
        take: parseInt(pageSizeNum),
        where: { productId },
        select: commentSelect,
      })
      .catch((err) => next(err));

    const totalCountPromise = prisma.productComment
      .count({
        where: {
          productId,
        },
      })
      .catch((err) => next(err));

    Promise.all([commentPromise, totalCountPromise]).then(
      ([comments, totalCount]) => {
        return res.status(200).send({ totalCount, comments });
      }
    );
  }
);

/** GET */
productCommentRouter.get(
  "/comment/:commentId",
  validateAccessToken,
  (req, res, next) => {
    const { commentId: id } = req.params;

    prisma.productComment
      .findUnique({ where: { id }, select: commentSelect })
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((err) => next(err));
  }
);

/** PATCH */
productCommentRouter.patch(
  "/comment/:commentId",
  validateAccessToken,
  validateCommentInput,
  (req, res, next) => {
    const { commentId: id } = req.params;

    prisma.productComment
      .update({ where: { id }, data: req.body, select: commentSelect })
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((err) => next(err));
  }
);

/** DELETE */
productCommentRouter.delete(
  "/comment/:commentId",
  validateAccessToken,
  (req, res, next) => {
    const { commentId: id } = req.params;

    prisma.productComment
      .delete({ where: { id } })
      .then((data) => {
        return res.status(204).send();
      })
      .catch((err) => next(err));
  }
);

export default productCommentRouter;

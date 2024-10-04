import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as commentService from "../services/commentService.js";

const router = express.Router();

router.post(
  "/",
  [body("content").isString().notEmpty(), body("productId").isInt({ min: 1 })],
  validate,
  asyncHandler(async (req, res) => {
    const comment = await commentService.createComment({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(comment);
  })
);

router.get(
  "/product/:productId",
  [
    param("productId").isInt({ min: 1 }),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const { comments, totalCount } = await commentService.getComments(
      productId,
      page,
      limit
    );
    res.json({ totalCount, list: comments });
  })
);

router.put(
  "/:id",
  [param("id").isInt({ min: 1 }), body("content").isString().notEmpty()],
  validate,
  asyncHandler(async (req, res) => {
    const comment = await commentService.updateComment(
      req.params.id,
      req.body.content
    );
    res.json(comment);
  })
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(async (req, res) => {
    await commentService.deleteComment(req.params.id);
    res.status(204).send();
  })
);

export default router;

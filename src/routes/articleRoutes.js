import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as articleController from "../controllers/articleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("title").isString().isLength({ min: 1, max: 50 }),
    body("content").isString().notEmpty(),
    body("image").isURL(),
  ],
  validate,
  asyncHandler(articleController.createArticle)
);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("order").optional().isIn(["recent", "old"]),
  ],
  validate,
  asyncHandler(articleController.getArticles)
);

router.get(
  "/:id",
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(articleController.getArticleById)
);

router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isInt({ min: 1 }),
    body("title").optional().isString().isLength({ min: 1, max: 50 }),
    body("content").optional().isString().notEmpty(),
    body("image").optional().isURL(),
  ],
  validate,
  asyncHandler(articleController.updateArticle)
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(articleController.deleteArticle)
);

export default router;

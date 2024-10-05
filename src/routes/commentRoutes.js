import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as commentController from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [body("content").isString().notEmpty(), body("productId").isInt({ min: 1 })],
  validate,
  asyncHandler(commentController.createComment)
);

router.get(
  "/product/:productId",
  [
    param("productId").isInt({ min: 1 }),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  asyncHandler(commentController.getComments)
);

router.put(
  "/:id",
  authMiddleware,
  [param("id").isInt({ min: 1 }), body("content").isString().notEmpty()],
  validate,
  asyncHandler(commentController.updateComment)
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(commentController.deleteComment)
);

export default router;

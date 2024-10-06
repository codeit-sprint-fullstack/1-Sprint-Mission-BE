import express from "express";
import validateUuid from "../middlewares/validateUuid.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/commentController.js";

const router = express.Router();

router.use(validateUuid);

router.get("/:articleId/comments", asyncHandler(controller.getArticleComments));
router.post(
  "/:articleId/comments",
  asyncHandler(controller.createArticleComment)
);

router.get("/:productId/comments", asyncHandler(controller.getProductComments));
router.post(
  "/:productId/comments",
  asyncHandler(controller.createProductComment)
);

router.patch("/:commentId", asyncHandler(controller.updateCommentById));
router.delete("/:commentId", asyncHandler(controller.deleteCommentById));

export default router;

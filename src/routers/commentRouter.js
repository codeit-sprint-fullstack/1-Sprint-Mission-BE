import express from "express";
import validateUuid from "../middlewares/validateUuid.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/commentController.js";

const router = express.Router();

router.get(
  "/:articleId/comments",
  validateUuid,
  asyncHandler(controller.getCommentList)
);
router.post("/:articleId/comments", asyncHandler(controller.createComment));

router.get(
  "/:productId/comments",
  validateUuid,
  asyncHandler(controller.getCommentList)
);
router.post(
  "/:productId/comments",
  validateUuid,
  asyncHandler(controller.createComment)
);

router.patch(
  "/:commentId",
  validateUuid,
  asyncHandler(controller.updateCommentById)
);
router.delete(
  "/:commentId",
  validateUuid,
  asyncHandler(controller.deleteCommentById)
);

export default router;

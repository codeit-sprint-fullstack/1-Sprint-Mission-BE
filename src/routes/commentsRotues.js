import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getComments,
  postComment,
  deleteComment,
  patchComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:productId/comments", getComments);
router.post("/:productId/comments", authenticateToken, postComment);
router.delete(
  "/:productId/comments/:commentId",
  authenticateToken,
  deleteComment
);
router.patch(
  "/:productId/comments/:commentId",
  authenticateToken,
  patchComment
);

export default router;

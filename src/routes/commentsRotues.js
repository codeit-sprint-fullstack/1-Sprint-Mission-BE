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
router.delete("/comments/:commentId", authenticateToken, deleteComment);
router.patch("/comments/:commentId", authenticateToken, patchComment);

export default router;

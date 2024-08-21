import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../service/productCommentService.js";

const router = express.Router();
// http://localhost:5432/productcomments
router.post("/:productId", createComment);
router.get("/:productId", getComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;

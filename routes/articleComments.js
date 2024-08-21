import express from "express";
import {
  createArticleComment,
  getArticleComments,
  updateArticleComment,
  deleteArticleComment,
} from "../service/articleCommentService.js";

const router = express.Router();
// http://localhost:5432/articlecomments
router.post("/:articleId", createArticleComment);
router.get("/:articleId", getArticleComments);
router.put("/:id", updateArticleComment);
router.delete("/:id", deleteArticleComment);

export default router;

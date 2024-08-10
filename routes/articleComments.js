import express from "express";
import createArticleComment from "./articleCommentsCRUD/createArticleComment.js";
import getArticleComments from "./articleCommentsCRUD/getArticleComment.js";
import updateArticleComment from "./articleCommentsCRUD/updateArticleComment.js";
import deleteArticleComment from "./articleCommentsCRUD/deleteArticleComment.js";

const router = express.Router();
router.post("/:articleId", createArticleComment);
router.get("/:articleId", getArticleComments);
router.patch("/:id", updateArticleComment);
router.delete("/:id", deleteArticleComment);

export default router;

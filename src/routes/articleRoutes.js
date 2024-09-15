import express from "express";
import * as a from "../controllers/articleController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getArticleComments,
  createArticleComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", asyncHandler(a.getArticles));
router.get("/:articleId", asyncHandler(a.getArticleById));
router.post("/", asyncHandler(a.createArticle));
router.patch("/:articleId", asyncHandler(a.updateArticleById));
router.delete("/:articleId", asyncHandler(a.deleteArticleById));

//get comments, create comment
router.get("/:articleId/comments", asyncHandler(getArticleComments));
router.post("/:articleId/comments", asyncHandler(createArticleComment));

export default router;

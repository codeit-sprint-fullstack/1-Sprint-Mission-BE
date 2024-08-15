import express from "express";
import * as a from "../controllers/articleController.js";
import { asyncHandler } from "../utils/errorHandler.js";
import {
  getArticleComments,
  createArticleComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", asyncHandler(a.getArticles));
router.get("/:id", asyncHandler(a.getArticleById));
router.post("/", asyncHandler(a.createArticle));
router.patch("/:id", asyncHandler(a.updateArticleById));
router.delete("/:id", asyncHandler(a.deleteArticleById));

//get comments, create comment
router.get("/:id/comments", asyncHandler(getArticleComments));
router.post("/:id/comments", asyncHandler(createArticleComment));

export default router;

import express from "express";
import controller from "../controllers/articleController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getArticleComments,
  createArticleComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", asyncHandler(controller.getArticleList));
router.get("/:articleId", asyncHandler(controller.getArticleById));
router.post("/", asyncHandler(controller.createArticle));
router.patch("/:articleId", asyncHandler(controller.updateArticleById));
router.delete("/:articleId", asyncHandler(controller.deleteArticleById));

//get comments, create comment
router.get("/:articleId/comments", asyncHandler(getArticleComments));
router.post("/:articleId/comments", asyncHandler(createArticleComment));

export default router;

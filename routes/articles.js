import express from "express";
import {
  createArticle,
  getArticleById,
  getArticles,
  updateArticle,
  deleteArticle,
} from "../service/articleService.js";

const router = express.Router();

router.post("/", createArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;

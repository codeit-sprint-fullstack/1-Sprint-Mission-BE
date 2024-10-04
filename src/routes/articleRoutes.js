import express from "express";
import articleController from "../controllers/articleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, articleController.createArticle);
router.get("/", articleController.getArticles);
router.get("/:articleId", articleController.getArticleById);
router.patch("/:articleId", authMiddleware, articleController.updateArticle);
router.delete("/:articleId", authMiddleware, articleController.deleteArticle);

export default router;

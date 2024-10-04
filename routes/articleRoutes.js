import express from "express";
import * as articleController from "../controllers/articleController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//https://thrift-shop.onrender.com/articles
router.post("/", verifyToken, articleController.createArticle);
router.get("/", articleController.getArticles);
router.get("/:articleId", verifyToken, articleController.getArticleById);
router.patch("/:articleId", verifyToken, articleController.updateArticle);
router.delete("/:articleId", verifyToken, articleController.deleteArticle);
router.post("/:articleId/like", verifyToken, articleController.addLike);
router.delete("/:articleId/like", verifyToken, articleController.deleteLike);

export default router;

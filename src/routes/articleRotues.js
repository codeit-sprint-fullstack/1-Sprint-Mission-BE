import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getArticles, getArticleId } from "../controllers/articleController.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:articleId", getArticleId);

export default router;

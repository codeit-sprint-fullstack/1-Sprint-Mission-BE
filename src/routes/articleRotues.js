import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getArticles } from "../controllers/articleController.js";

const router = express.Router();

router.get("/", getArticles);

export default router;

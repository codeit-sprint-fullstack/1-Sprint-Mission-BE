const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.get("/", articleController.getArticles);
router.get("/:articleId", articleController.getArticleById);
router.post("/", articleController.createArticle);
router.put("/:articleId", articleController.updateArticle);
router.delete("/:articleId", articleController.deleteArticle);

module.exports = router;

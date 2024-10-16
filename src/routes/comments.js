const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth");

router.get("/products/:productId", commentController.getCommentsByProduct);
router.get("/articles/:articleId", commentController.getCommentsByArticle);
router.post("/", authMiddleware, commentController.createComment);
router.put("/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;

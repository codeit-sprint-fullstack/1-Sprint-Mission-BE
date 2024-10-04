const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

// 상품에 댓글 작성
router.post(
  "/products/:productId/comments",
  authMiddleware,
  commentController.createProductComment
);

// 상품 댓글 목록 조회
router.get(
  "/products/:productId/comments",
  commentController.getProductComments
);

// 게시글에 댓글 작성
router.post(
  "/articles/:articleId/comments",
  authMiddleware,
  commentController.createArticleComment
);

// 게시글 댓글 목록 조회
router.get(
  "/articles/:articleId/comments",
  commentController.getArticleComments
);

// 댓글 수정
router.patch(
  "/comments/:commentId",
  authMiddleware,
  commentController.updateComment
);

// 댓글 삭제
router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;

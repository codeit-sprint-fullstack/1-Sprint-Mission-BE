const express = require('express');
const router = express.Router();
const {
  createProductComment,
  createArticleComment,
  updateComment,
  deleteComment,
  getProductComments,
  getArticleComments,
} = require('../controllers/commentController');

// 댓글 관련 라우트
router.post('/products/:productId/comments', createProductComment);  // /api/comments/products/:productId/comments
router.post('/articles/:articleId/comments', createArticleComment);  // /api/comments/articles/:articleId/comments
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/products/:productId/comments', getProductComments);  // /api/comments/products/:productId/comments
router.get('/articles/:articleId/comments', getArticleComments);  // /api/comments/articles/:articleId/comments

module.exports = router;


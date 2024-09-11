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

// 중복된 경로 제거하고 상대 경로로 수정
router.post('/:productId/comments', createProductComment);  // /api/products/:productId/comments
router.post('/:articleId/comments', createArticleComment);  // /api/articles/:articleId/comments
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/:productId/comments', getProductComments);  // /api/products/:productId/comments
router.get('/:articleId/comments', getArticleComments);  // /api/articles/:articleId/comments

module.exports = router;

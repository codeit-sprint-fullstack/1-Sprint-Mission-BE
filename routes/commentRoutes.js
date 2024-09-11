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

// 중복된 경로 제거
router.post('/products/:productId/comments', createProductComment);
router.post('/articles/:articleId/comments', createArticleComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/products/:productId/comments', getProductComments);
router.get('/articles/:articleId/comments', getArticleComments);

module.exports = router;

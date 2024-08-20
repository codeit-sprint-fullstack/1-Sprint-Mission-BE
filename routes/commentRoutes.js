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

router.post('/products/:productId/comments', createProductComment);
router.post('/articles/:articleId/comments', createArticleComment);
router.patch('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);
router.get('/products/:productId/comments', getProductComments);
router.get('/articles/:articleId/comments', getArticleComments);

module.exports = router;


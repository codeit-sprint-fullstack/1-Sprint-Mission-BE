const express = require('express');
const router = express.Router();
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

router.post('/articles', createArticle);
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.patch('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);
router.get('/articles/best', getBestArticles);

module.exports = router;


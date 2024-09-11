const express = require('express');
const router = express.Router();
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getBestArticles,
} = require('../controllers/articleController');

// 중복된 경로를 제거하고 상대 경로로 설정
router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.patch('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.get('/best', getBestArticles);

module.exports = router;


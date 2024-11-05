// articleRoutes.js
const express = require('express');
const { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 게시글 생성 - 로그인한 사용자만 가능
router.post('/', authMiddleware, createArticle);

// 모든 게시글 목록 조회
router.get('/', getArticles);

// 특정 게시글 조회
router.get('/:articleId', getArticleById);

// 게시글 수정 - 로그인한 사용자만 가능
router.patch('/:articleId', authMiddleware, updateArticle);

// 게시글 삭제 - 로그인한 사용자만 가능
router.delete('/:articleId', authMiddleware, deleteArticle);

module.exports = router;

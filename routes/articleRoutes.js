const express = require('express');
const { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController');
const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 게시글 생성 - 로그인한 사용자만 가능, 이미지 최대 3개
router.post('/', authMiddleware, upload.array('images', 3), createArticle);

// 모든 게시글 목록 조회
router.get('/', getArticles);

// 특정 게시글 조회
router.get('/:id', getArticleById);

// 게시글 수정 - 로그인한 사용자만 가능
router.patch('/:id', authMiddleware, upload.array('images', 3), updateArticle);

// 게시글 삭제 - 로그인한 사용자만 가능
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;


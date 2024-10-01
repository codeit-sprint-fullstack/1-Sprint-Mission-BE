const express = require('express');
const { createProductComment, createArticleComment, updateProductComment, updateArticleComment, deleteProductComment, deleteArticleComment, getProductComments, getArticleComments } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post('/products/:productId/comments', authMiddleware, createProductComment);

// 게시글에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post('/articles/:articleId/comments', authMiddleware, createArticleComment);

// 상품 댓글 목록 조회 - 로그인한 사용자만 가능
router.get('/products/:productId/comments', authMiddleware, getProductComments);

// 게시글 댓글 목록 조회 - 로그인한 사용자만 가능
router.get('/articles/:articleId/comments', authMiddleware, getArticleComments);

// 상품 댓글 수정 - 로그인한 사용자만 가능
router.patch('/products/:productId/comments/:id', authMiddleware, updateProductComment);

// 게시글 댓글 수정 - 로그인한 사용자만 가능
router.patch('/articles/:articleId/comments/:id', authMiddleware, updateArticleComment);

// 상품 댓글 삭제 - 로그인한 사용자만 가능
router.delete('/products/:productId/comments/:id', authMiddleware, deleteProductComment);

// 게시글 댓글 삭제 - 로그인한 사용자만 가능
router.delete('/articles/:articleId/comments/:id', authMiddleware, deleteArticleComment);

module.exports = router;


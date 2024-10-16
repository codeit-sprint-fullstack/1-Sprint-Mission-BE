const express = require('express');
const { likeProduct, unlikeProduct, likeArticle, unlikeArticle } = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품 좋아요 - 로그인한 사용자만 가능
router.post('/products/:productId/like', authMiddleware, likeProduct);

// 상품 좋아요 취소 - 로그인한 사용자만 가능
router.delete('/products/:productId/like', authMiddleware, unlikeProduct);

// 게시글 좋아요 - 로그인한 사용자만 가능
router.post('/articles/:articleId/like', authMiddleware, likeArticle);

// 게시글 좋아요 취소 - 로그인한 사용자만 가능
router.delete('/articles/:articleId/like', authMiddleware, unlikeArticle);

module.exports = router;


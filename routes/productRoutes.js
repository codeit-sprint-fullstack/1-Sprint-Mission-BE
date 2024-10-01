const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품 등록 - 로그인한 사용자만 가능, 이미지 최대 3개
router.post('/', authMiddleware, upload.array('images', 3), createProduct);

// 모든 상품 목록 조회
router.get('/', getProducts);

// 특정 상품 조회
router.get('/:id', getProductById);

// 상품 수정 - 로그인한 사용자만 가능
router.patch('/:id', authMiddleware, upload.array('images', 3), updateProduct);

// 상품 삭제 - 로그인한 사용자만 가능
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;


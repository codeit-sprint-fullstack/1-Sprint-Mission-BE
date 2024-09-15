const express = require('express'); // Express 모듈을 불러옴
const router = express.Router(); // 라우터 객체 생성 (라우터를 설정하기 위해 사용)
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController'); // controllers 폴더 안에 있는 productController에서 각 함수 불러옴

// server.js에서 app.use('/api/products', productRoutes)로 기본 경로가 설정

router.post('/', createProduct); // 상품을 생성 /api/products
router.get('/', getProducts); // 모든 상품 목록 조회 /api/products
router.get('/:id', getProductById); // 특정 ID를 가진 상품 조회 /api/products/:id
router.patch('/:id', updateProduct); // 특정 ID를 가진 상품 수정 /api/products/:id
router.delete('/:id', deleteProduct); // 특정 ID를 가진 상품 삭제 /api/products/:id

module.exports = router;


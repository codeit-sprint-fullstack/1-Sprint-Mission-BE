const express = require('express'); // Express 모듈을 불러옴
const router = express.Router(); // 라우터 객체 생성 (라우터를 설정하기 위해 사용)
const {
  createProductComment,
  createArticleComment,
  updateComment,
  deleteComment,
  getProductComments,
  getArticleComments,
} = require('../controllers/commentController'); // controllers 폴더 안에 있는 commentController에서 각 함수 불러옴

// server.js에서 app.use('/api/comments', commentRoutes)로 기본 경로가 설정

router.post('/products/:productId/comments', createProductComment);  // 상품에 대한 댓글을 생성 /api/comments/products/:productId/comments
router.post('/articles/:articleId/comments', createArticleComment);  // 게시글에 대한 댓글을 생성 /api/comments/articles/:articleId/comments
router.patch('/:id', updateComment); // 댓글 수정 /api/comments/:id
router.delete('/:id', deleteComment); // 댓글 삭제 /api/comments/:id
router.get('/products/:productId/comments', getProductComments);  // 특정 상품에 대한 댓글 목록 조회 /api/comments/products/:productId/comments
router.get('/articles/:articleId/comments', getArticleComments);  // 특정 게시글에 대한 댓글 목록 조회 /api/comments/articles/:articleId/comments

module.exports = router;


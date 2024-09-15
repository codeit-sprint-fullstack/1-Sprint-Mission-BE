const express = require('express'); // Express 모듈을 불러옴
const router = express.Router(); // 라우터 객체 생성 (라우터를 설정하기 위해 사용)
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getBestArticles,
} = require('../controllers/articleController'); // controllers 폴더 안에 있는 articleController에서 각 함수 불러옴

// server.js에서 app.use('/api/articles', articleRoutes)로 기본 경로가 설정

router.post('/', createArticle); // 게시글 생성 /api/articles
router.get('/best', getBestArticles);  // 베스트 게시글 조회  /api/articles/best
router.get('/', getArticles); // 게시글 목록 조회  /api/articles
router.get('/:id', getArticleById); // 특정 게시글 조회 /api/articles/:id
router.patch('/:id', updateArticle); // 게시글 수정 /api/articles/:id
router.delete('/:id', deleteArticle); // 게시글 삭제 /api/articles/:id


module.exports = router; 

import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController'; // articleController에서 함수들을 가져옵니다.
import upload from '../utils/multer'; // 파일 업로드를 위한 multer 설정을 가져옵니다.
import authMiddleware from '../middlewares/authMiddleware'; // 인증 미들웨어를 가져옵니다.

const router = express.Router();

// 게시글 생성 - 로그인한 사용자만 가능 (authMiddleware를 사용하여 로그인한 사용자만 접근 가능), 이미지 최대 3개
router.post('/', authMiddleware, upload.array('images', 3), createArticle);

// 모든 게시글 목록 조회
router.get('/', getArticles);

// 특정 게시글 조회
router.get('/:id', getArticleById);

// 게시글 수정 - 로그인한 사용자만 가능
router.patch('/:id', authMiddleware, upload.array('images', 3), updateArticle);

// 게시글 삭제 - 로그인한 사용자만 가능
router.delete('/:id', authMiddleware, deleteArticle);

export default router; // CommonJS의 module.exports 대신 ES6의 export default를 사용합니다.

// 맨 뒤에 나오는 함수 이름은 articleController 파일에서 가져온 함수

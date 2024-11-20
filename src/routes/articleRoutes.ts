import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import {
  getArticles,
  getArticleId,
  patchArticle,
  deleteArticle,
  postArticle,
  postArticleFavorite,
} from '../controllers/articleController';

// Express 라우터 초기화
const router = express.Router();

// 각 경로에 적절한 HTTP 메서드와 핸들러 함수 연결
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getArticles(req, res, next);
});

router.get('/:articleId', (req: Request, res: Response, next: NextFunction) => {
  getArticleId(req, res, next);
});

router.patch(
  '/:articleId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    patchArticle(req, res, next);
  }
);

router.delete(
  '/:articleId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    deleteArticle(req, res, next);
  }
);

router.post(
  '/',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    postArticle(req, res, next);
  }
);

router.post(
  '/:articleId/favorites',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    postArticleFavorite(req, res);
  }
);

// 라우터 객체 내보내기
export default router;

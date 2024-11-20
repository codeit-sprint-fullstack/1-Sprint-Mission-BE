import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import {
  getComments,
  postComment,
  deleteComment,
  patchComment,
} from '../controllers/commentController';

const router = express.Router();

// 상품(Product) 관련 경로
router.get(
  '/product/:productId/comments',
  (req: Request, res: Response, next: NextFunction) => {
    getComments(req, res, next);
  }
);

router.post(
  '/product/:productId/comments',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    postComment(req, res, next);
  }
);

router.delete(
  '/comments/:commentId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    deleteComment(req, res, next);
  }
);

router.patch(
  '/comments/:commentId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    patchComment(req, res, next);
  }
);

// 게시글(Article) 관련 경로
router.get(
  '/article/:articleId/comments',
  (req: Request, res: Response, next: NextFunction) => {
    getComments(req, res, next);
  }
);

router.post(
  '/article/:articleId/comments',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    postComment(req, res, next);
  }
);

router.delete(
  '/comments/:commentId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    deleteComment(req, res, next);
  }
);

router.patch(
  '/comments/:commentId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    patchComment(req, res, next);
  }
);

export default router;

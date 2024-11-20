import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import {
  getProducts,
  postProduct,
  getProductId,
  deleteProduct,
  patchProduct,
  postFavorites,
  CustomRequest,
} from '../controllers/productController';

const router = express.Router();

// 상품 목록 가져오기
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getProducts(req, res, next);
});

// 상품 등록 (인증 필요)
router.post(
  '/',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    postProduct(req as CustomRequest, res, next);
  }
);

// 특정 상품 정보 조회
router.get('/:productId', (req: Request, res: Response, next: NextFunction) => {
  getProductId(req, res, next);
});

// 특정 상품 삭제 (인증 필요)
router.delete(
  '/:productId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    deleteProduct(req as CustomRequest, res, next);
  }
);

// 특정 상품 수정 (인증 필요)
router.patch(
  '/:productId',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    patchProduct(req as CustomRequest, res, next);
  }
);

// 특정 상품 좋아요 추가/취소 (인증 필요)
router.post(
  '/:productId/favorites',
  authenticateToken,
  (req: Request, res: Response) => {
    postFavorites(req as CustomRequest, res);
  }
);

export default router;

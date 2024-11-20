import express, { Request, Response, NextFunction } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// 상품 등록 - 로그인한 사용자만 가능
router.post("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  createProduct(req, res, next);
});

// 상품 목록 조회
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  getProducts(req, res, next);
});

// 특정 상품 조회
router.get("/:productId", (req: Request, res: Response, next: NextFunction) => {
  getProductById(req, res, next);
});

// 상품 수정 - 로그인한 사용자만 가능
router.patch("/:productId", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateProduct(req, res, next);
});

// 상품 삭제 - 로그인한 사용자만 가능
router.delete("/:productId", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  deleteProduct(req, res, next);
});

export default router;

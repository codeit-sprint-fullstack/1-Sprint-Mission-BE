import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 현재 사용자 정보 조회
router.get("/me", authMiddleware, userController.getCurrentUser);

// 현재 사용자 정보 수정
router.patch("/me", authMiddleware, userController.updateCurrentUser);

// 비밀번호 변경
router.patch("/me/password", authMiddleware, userController.changePassword);

// 내가 등록한 상품 조회
router.get("/me/products", authMiddleware, userController.getMyProducts);

// 내가 좋아요한 상품 조회
router.get("/me/favorites", authMiddleware, userController.getMyFavorites);

export default router;

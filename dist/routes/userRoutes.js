"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// 현재 유저 정보 조회 - 로그인한 사용자만 가능
router.get("/me", authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.getCurrentUser)(req, res, next);
});
// 유저 정보 업데이트 - 로그인한 사용자만 가능
router.patch("/me", authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.updateUser)(req, res, next);
});
// 비밀번호 변경 - 로그인한 사용자만 가능
router.patch("/me/password", authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.updatePassword)(req, res, next);
});
// 유저의 상품 목록 조회 - 로그인한 사용자만 가능
router.get("/me/products", authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.getUserProducts)(req, res, next);
});
// 유저의 좋아요 상품 목록 조회 - 로그인한 사용자만 가능
router.get("/me/favorites", authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.getUserFavorites)(req, res, next);
});
exports.default = router;

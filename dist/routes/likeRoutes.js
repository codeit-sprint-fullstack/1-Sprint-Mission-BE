"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// 상품 좋아요 - 로그인한 사용자만 가능
router.post("/products/:productId/like", authMiddleware_1.default, (req, res, next) => {
    (0, likeController_1.likeProduct)(req, res, next);
});
// 상품 좋아요 취소 - 로그인한 사용자만 가능
router.delete("/products/:productId/like", authMiddleware_1.default, (req, res, next) => {
    (0, likeController_1.unlikeProduct)(req, res, next);
});
// 게시글 좋아요 - 로그인한 사용자만 가능
router.post("/articles/:articleId/like", authMiddleware_1.default, (req, res, next) => {
    (0, likeController_1.likeArticle)(req, res, next);
});
// 게시글 좋아요 취소 - 로그인한 사용자만 가능
router.delete("/articles/:articleId/like", authMiddleware_1.default, (req, res, next) => {
    (0, likeController_1.unlikeArticle)(req, res, next);
});
exports.default = router;

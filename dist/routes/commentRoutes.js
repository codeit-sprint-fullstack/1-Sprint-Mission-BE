"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// 상품에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post("/products/:productId/comments", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.createProductComment)(req, res, next);
});
// 게시글에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post("/articles/:articleId/comments", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.createArticleComment)(req, res, next);
});
// 상품에 대한 댓글 조회
router.get("/products/:productId/comments", (req, res, next) => {
    (0, commentController_1.getProductComments)(req, res, next);
});
// 게시글 댓글 목록 조회
router.get("/articles/:articleId/comments", (req, res, next) => {
    (0, commentController_1.getArticleComments)(req, res, next);
});
// 상품 댓글 수정 - 로그인한 사용자만 가능
router.patch("/products/:productId/comments/:id", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.updateProductComment)(req, res, next);
});
// 게시글 댓글 수정 - 로그인한 사용자만 가능
router.patch("/articles/:articleId/comments/:id", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.updateArticleComment)(req, res, next);
});
// 상품 댓글 삭제 - 로그인한 사용자만 가능
router.delete("/products/:productId/comments/:id", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.deleteProductComment)(req, res, next);
});
// 게시글 댓글 삭제 - 로그인한 사용자만 가능
router.delete("/articles/:articleId/comments/:id", authMiddleware_1.default, (req, res, next) => {
    (0, commentController_1.deleteArticleComment)(req, res, next);
});
exports.default = router;

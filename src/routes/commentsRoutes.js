"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middleware/authenticateToken");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
// 상품(Product) 관련 경로
router.get('/product/:productId/comments', (req, res, next) => {
    (0, commentController_1.getComments)(req, res, next);
});
router.post('/product/:productId/comments', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.postComment)(req, res, next);
});
router.delete('/comments/:commentId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.deleteComment)(req, res, next);
});
router.patch('/comments/:commentId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.patchComment)(req, res, next);
});
// 게시글(Article) 관련 경로
router.get('/article/:articleId/comments', (req, res, next) => {
    (0, commentController_1.getComments)(req, res, next);
});
router.post('/article/:articleId/comments', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.postComment)(req, res, next);
});
router.delete('/comments/:commentId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.deleteComment)(req, res, next);
});
router.patch('/comments/:commentId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, commentController_1.patchComment)(req, res, next);
});
exports.default = router;

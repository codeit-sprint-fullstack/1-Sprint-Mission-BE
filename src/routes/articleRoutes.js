"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middleware/authenticateToken");
const articleController_1 = require("../controllers/articleController");
// Express 라우터 초기화
const router = express_1.default.Router();
// 각 경로에 적절한 HTTP 메서드와 핸들러 함수 연결
router.get('/', (req, res, next) => {
    (0, articleController_1.getArticles)(req, res, next);
});
router.get('/:articleId', (req, res, next) => {
    (0, articleController_1.getArticleId)(req, res, next);
});
router.patch('/:articleId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, articleController_1.patchArticle)(req, res, next);
});
router.delete('/:articleId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, articleController_1.deleteArticle)(req, res, next);
});
router.post('/', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, articleController_1.postArticle)(req, res, next);
});
router.post('/:articleId/favorites', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, articleController_1.postArticleFavorite)(req, res);
});
// 라우터 객체 내보내기
exports.default = router;

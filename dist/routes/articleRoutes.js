"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../controllers/articleController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// 게시글 생성 - 로그인한 사용자만 가능
router.post("/", authMiddleware_1.default, (req, res, next) => {
    (0, articleController_1.createArticle)(req, res, next);
});
// 모든 게시글 목록 조회
router.get("/", (req, res, next) => {
    (0, articleController_1.getArticles)(req, res, next);
});
// 특정 게시글 조회
router.get("/:articleId", (req, res, next) => {
    (0, articleController_1.getArticleById)(req, res, next);
});
// 게시글 수정 - 로그인한 사용자만 가능
router.patch("/:articleId", authMiddleware_1.default, (req, res, next) => {
    (0, articleController_1.updateArticle)(req, res, next);
});
// 게시글 삭제 - 로그인한 사용자만 가능
router.delete("/:articleId", authMiddleware_1.default, (req, res, next) => {
    (0, articleController_1.deleteArticle)(req, res, next);
});
exports.default = router;

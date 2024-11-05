"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateArticle_js_1 = require("../middlewares/validateArticle.js");
const express_1 = __importDefault(require("express"));
const articleController = __importStar(require("../controllers/articleController"));
const verifyToken_1 = require("../middlewares/verifyToken");
const imageUpload_1 = require("../middlewares/imageUpload");
const router = express_1.default.Router();
router
    .route("/")
    .post(verifyToken_1.verifyToken, imageUpload_1.imageUpload.array("images", 3), validateArticle_js_1.validateArticle, (req, res, next) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req;
    articleController.createArticle(extendedReq, res, next);
})
    .get(articleController.getArticles);
router
    .route("/:articleId")
    .all(verifyToken_1.verifyToken)
    .get((req, res, next) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req;
    articleController.getArticleById(extendedReq, res, next);
})
    .patch(imageUpload_1.imageUpload.array("images", 3), (req, res, next) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req;
    articleController.updateArticle(extendedReq, res, next);
})
    .delete(articleController.deleteArticle);
router
    .route("/:articleId/like")
    .all(verifyToken_1.verifyToken)
    .post((req, res, next) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req;
    articleController.addLike(extendedReq, res, next);
})
    .delete((req, res, next) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req;
    articleController.deleteLike(extendedReq, res, next);
});
exports.default = router;

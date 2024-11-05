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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.addLike = exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticles = exports.createArticle = void 0;
const articleService = __importStar(require("../services/articleService.js"));
const formatArticleResponse = (article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    images: Array.isArray(article.images) ? article.images : [],
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    writer: {
        nickname: article.writer.nickname,
        id: article.writer.id,
    },
    isLiked: article.isLiked,
});
const sendResponse = (res, data, status = 200) => res.status(status).json(data);
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files, user } = req;
        // user와 files가 존재하는지 확인
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const images = files ? files.map((file) => file.location) : [];
        const { content, title } = req.body;
        const newArticle = yield articleService.createArticle(images, content, title, user.id);
        return sendResponse(res, newArticle, 201);
    }
    catch (error) {
        next(error);
    }
});
exports.createArticle = createArticle;
const getArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", pageSize = "10", keyword = "", orderBy = "recent", } = req.query;
        const { list, totalCount } = yield articleService.getArticles(parseInt(page), parseInt(pageSize), keyword, orderBy);
        const responseList = list.map(formatArticleResponse);
        sendResponse(res, { list: responseList, totalCount });
    }
    catch (error) {
        next(error);
    }
});
exports.getArticles = getArticles;
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const articleId = req.params.articleId;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const article = yield articleService.getArticleById(parseInt(articleId), userId);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        const response = formatArticleResponse(article);
        sendResponse(res, response);
    }
    catch (error) {
        next(error);
    }
});
exports.getArticleById = getArticleById;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files, user } = req;
        const { articleId } = req.params;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newImagePaths = files
            ? files.map((file) => file.location)
            : [];
        let existingImages = [];
        if (req.body["existingImages"]) {
            if (Array.isArray(req.body["existingImages"])) {
                existingImages = req.body["existingImages"];
            }
            else {
                existingImages = [req.body["existingImages"]];
            }
        }
        const images = [...existingImages, ...newImagePaths];
        const { title, content } = req.body;
        const updatedArticle = yield articleService.updateArticle(parseInt(articleId), userId, images, title, content);
        const response = formatArticleResponse(updatedArticle);
        sendResponse(res, response);
    }
    catch (error) {
        next(error);
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        yield articleService.deleteArticle(parseInt(articleId));
        sendResponse(res, { message: "Article deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteArticle = deleteArticle;
const addLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const { user } = req;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updatedArticle = yield articleService.addLike(parseInt(articleId), userId);
        const response = formatArticleResponse(updatedArticle);
        sendResponse(res, response);
    }
    catch (error) {
        next(error);
    }
});
exports.addLike = addLike;
const deleteLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const { user } = req;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updatedArticle = yield articleService.deleteLike(parseInt(articleId), userId);
        const response = formatArticleResponse(updatedArticle);
        sendResponse(res, response);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteLike = deleteLike;

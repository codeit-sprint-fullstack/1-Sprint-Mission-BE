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
exports.deleteComment = exports.updateComment = exports.getArticleComments = exports.getProductComments = exports.createArticleComment = exports.createProductComment = void 0;
const commentService = __importStar(require("../services/commentService"));
const createCommentResponse = (comment, type) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    [`${type}Id`]: comment[`${type}Id`],
    writer: {
        nickname: comment.writer.nickname,
        id: comment.writer.id,
        createdAt: comment.writer.createdAt,
        updatedAt: comment.writer.updatedAt,
    },
});
const createComment = (req, res, next, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const serviceType = type.charAt(0).toUpperCase() + type.slice(1);
    const { content } = req.body;
    const id = req.params[`${type}Id`];
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const newComment = yield commentService[`create${serviceType}Comment`](content, userId, parseInt(id));
        const response = createCommentResponse(newComment, type);
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
});
const createProductComment = (req, res, next) => {
    createComment(req, res, next, "product");
};
exports.createProductComment = createProductComment;
const createArticleComment = (req, res, next) => {
    createComment(req, res, next, "article");
};
exports.createArticleComment = createArticleComment;
const getComments = (req, res, next, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const serviceType = type.charAt(0).toUpperCase() + type.slice(1);
        const { limit = "4", cursor = null } = req.query;
        const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a[`${type}Id`];
        const { list, nextCursor } = yield commentService[`get${serviceType}Comments`](parseInt(limit), cursor, parseInt(id));
        const responseList = list.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            writer: {
                nickname: comment.writer.nickname,
                id: comment.writer.id,
                image: comment.writer.image,
            },
        }));
        res.status(200).json({ list: responseList, nextCursor });
    }
    catch (error) {
        next(error);
    }
});
const getProductComments = (req, res, next) => {
    getComments(req, res, next, "product");
};
exports.getProductComments = getProductComments;
const getArticleComments = (req, res, next) => {
    getComments(req, res, next, "article");
};
exports.getArticleComments = getArticleComments;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const updatedComment = yield commentService.updateComment(commentId, content);
        res.status(200).json(updatedComment);
    }
    catch (error) {
        next(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        yield commentService.deleteComment(commentId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteComment = deleteComment;

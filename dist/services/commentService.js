"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getArticleComments = exports.getProductComments = exports.createArticleComment = exports.createProductComment = void 0;
const index_1 = __importDefault(require("../models/index"));
const parseId = (id) => parseInt(id, 10);
const getCursorOptions = (cursor) => {
    const parsedCursor = parseInt(cursor, 10);
    if (!cursor || isNaN(parsedCursor))
        return {};
    return {
        cursor: { id: parsedCursor },
        skip: 1,
    };
};
const getCommentOptions = (limit, cursor, entityId, entityType) => (Object.assign({ take: limit, orderBy: { createdAt: "desc" }, include: { writer: true }, where: {
        [entityType]: entityId,
    } }, getCursorOptions(cursor)));
const createComment = (content, userId, entityId, entityType) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        content,
        writer: { connect: { id: userId } },
        [entityType]: { connect: { id: entityId } },
    };
    const newComment = yield index_1.default.comment.create({
        data,
        include: { writer: true },
    });
    return newComment;
});
const getComments = (limit, cursor, entityId, entityType) => __awaiter(void 0, void 0, void 0, function* () {
    const queryOptions = getCommentOptions(limit, cursor, entityId, entityType);
    const list = yield index_1.default.comment.findMany(queryOptions);
    const nextCursor = list.length === limit ? list[list.length - 1].id : null;
    return { list, nextCursor };
});
const createProductComment = (content, userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    return createComment(content, userId, parseId(productId), "product");
});
exports.createProductComment = createProductComment;
const createArticleComment = (content, userId, articleId) => __awaiter(void 0, void 0, void 0, function* () {
    return createComment(content, userId, parseId(articleId), "article");
});
exports.createArticleComment = createArticleComment;
const getProductComments = (limit, cursor, productId) => __awaiter(void 0, void 0, void 0, function* () {
    return getComments(limit, cursor, parseId(productId), "productId");
});
exports.getProductComments = getProductComments;
const getArticleComments = (limit, cursor, articleId) => __awaiter(void 0, void 0, void 0, function* () {
    return getComments(limit, cursor, parseId(articleId), "articleId");
});
exports.getArticleComments = getArticleComments;
const updateComment = (commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return index_1.default.comment.update({
        where: { id: parseId(commentId) },
        data: { content },
        include: { writer: true },
    });
});
exports.updateComment = updateComment;
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.default.comment.delete({ where: { id: parseId(commentId) } });
});
exports.deleteComment = deleteComment;

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
exports.deleteLike = exports.addLike = exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.createArticle = exports.getArticles = void 0;
const index_1 = __importDefault(require("../models/index"));
const includeRelations = (userId) => ({
    writer: true,
    favorites: {
        where: { userId: userId },
        select: { id: true, userId: true, articleId: true }, // favorites의 전체 필드를 선택하도록 수정
    },
});
const generateWhereCondition = (keyword) => {
    return keyword
        ? {
            OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { content: { contains: keyword, mode: "insensitive" } },
            ],
        }
        : {};
};
const generateOrderCondition = (orderBy) => {
    if (orderBy === "favorite") {
        return [{ likeCount: "desc" }, { createdAt: "desc" }];
    }
    return { createdAt: "desc" };
};
const getArticles = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 10, keyword = "", orderBy = "recent") {
    const offset = (page - 1) * pageSize;
    const [list, totalCount] = yield index_1.default.$transaction([
        index_1.default.article.findMany({
            where: generateWhereCondition(keyword),
            skip: offset,
            take: pageSize,
            orderBy: generateOrderCondition(orderBy),
            include: {
                writer: true,
                favorites: true, // Include all favorite fields
            },
        }),
        index_1.default.article.count({
            where: generateWhereCondition(keyword),
        }),
    ]);
    const listWithLikeStatus = list.map((article) => (Object.assign(Object.assign({}, article), { favorites: article.favorites.map((fav) => ({
            id: fav.id,
            userId: fav.userId,
            articleId: fav.articleId,
        })) })));
    return { list: listWithLikeStatus, totalCount, page, pageSize };
});
exports.getArticles = getArticles;
const createArticle = (images, content, title, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newArticle = yield index_1.default.article.create({
        data: { images, content, title, userId },
        include: includeRelations(userId),
    });
    // 수동으로 Article 타입에 맞도록 매핑 (favorites가 부족한 경우 대응)
    return Object.assign(Object.assign({}, newArticle), { favorites: newArticle.favorites.map((fav) => ({
            id: fav.id,
            userId: userId,
            articleId: newArticle.id,
        })) });
});
exports.createArticle = createArticle;
const getArticleById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ articleId, userId, }) {
    const article = yield index_1.default.article.findUnique({
        where: { id: articleId },
        include: includeRelations(userId),
    });
    if (!article)
        throw new Error("Article not found");
    const isLiked = article.favorites.length > 0;
    return Object.assign(Object.assign({}, article), { favorites: article.favorites.map((fav) => ({
            id: fav.id,
            userId: fav.userId,
            articleId: fav.articleId,
        })), isLiked });
});
exports.getArticleById = getArticleById;
const updateArticle = (articleId, userId, images, title, content) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedArticle = yield index_1.default.article.update({
        where: { id: articleId },
        data: { images, title, content },
        include: includeRelations(userId),
    });
    return Object.assign(Object.assign({}, updatedArticle), { favorites: updatedArticle.favorites.map((fav) => ({
            id: fav.id,
            userId: fav.userId,
            articleId: fav.articleId,
        })) });
});
exports.updateArticle = updateArticle;
const deleteArticle = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.default.article.delete({
        where: { id: articleId },
    });
});
exports.deleteArticle = deleteArticle;
const addLike = (_a) => __awaiter(void 0, [_a], void 0, function* ({ articleId, userId, }) {
    yield index_1.default.favorite.create({
        data: {
            articleId: articleId,
            userId: userId,
        },
    });
    return index_1.default.article.update({
        where: { id: articleId },
        data: {
            likeCount: { increment: 1 },
        },
        include: includeRelations(userId),
    });
});
exports.addLike = addLike;
const deleteLike = (_a) => __awaiter(void 0, [_a], void 0, function* ({ articleId, userId, }) {
    yield index_1.default.favorite.deleteMany({
        where: {
            articleId: articleId,
            userId: userId,
        },
    });
    return index_1.default.article.update({
        where: { id: articleId },
        data: {
            likeCount: { decrement: 1 },
        },
        include: includeRelations(userId),
    });
});
exports.deleteLike = deleteLike;

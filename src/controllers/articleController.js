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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postArticle = postArticle;
exports.getArticles = getArticles;
exports.getArticleId = getArticleId;
exports.patchArticle = patchArticle;
exports.deleteArticle = deleteArticle;
exports.postArticleFavorite = postArticleFavorite;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function postArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log('Request Body:', req.body); // 요청 데이터 확인
            const { name, content, images } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const article = yield prisma.article.create({
                data: {
                    name,
                    content,
                    images: images || undefined,
                    userId,
                },
            });
            res.status(200).json({ message: '게시물 추가 성공', article });
        }
        catch (error) {
            console.error('게시물 추가 중 오류 발생:', error);
            next(error); // next 함수로 에러 전달
        }
    });
}
function getArticles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const skip = (page - 1) * pageSize;
            const orderByField = req.query.orderByField || 'createdAt';
            const orderDir = req.query.orderDir || 'desc';
            const articles = yield prisma.article.findMany({
                skip,
                take: pageSize,
                orderBy: { [orderByField]: orderDir },
            });
            return res.status(200).json({ message: '게시물 정보 추출', articles });
        }
        catch (error) {
            console.error('게시물 정보 추출 중 오류 발생:', error);
            return res
                .status(500)
                .json({ message: '게시물 정보를 추출할 수 없습니다.' });
        }
    });
}
function getArticleId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { articleId } = req.params;
            const article = yield prisma.article.findUnique({
                where: { id: parseInt(articleId, 10) },
                include: {
                    comment: true,
                },
            });
            if (!article) {
                return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
            }
            return res.status(200).json({ message: '게시물 정보 추출', article });
        }
        catch (error) {
            console.error('게시물 정보 추출 중 오류 발생:', error);
            return res
                .status(500)
                .json({ message: '게시물 정보를 추출할 수 없습니다.' });
        }
    });
}
function patchArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { articleId } = req.params;
            const { name, content, images } = req.body;
            const article = yield prisma.article.findUnique({
                where: { id: parseInt(articleId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!article) {
                return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
            }
            if (article.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                return res
                    .status(403)
                    .json({ message: '게시물을 변경할 권한이 없습니다.' });
            }
            const imagesUrls = images
                ? images.map((image) => image.url)
                : [];
            const updatedArticle = yield prisma.article.update({
                where: { id: parseInt(articleId, 10) },
                data: {
                    name: name || undefined,
                    content: content || undefined,
                    images: imagesUrls.length ? imagesUrls : undefined,
                },
            });
            return res
                .status(200)
                .json({ message: '게시물 정보 변경 성공', updatedArticle });
        }
        catch (error) {
            console.error('게시물 정보 변경 중 오류 발생:', error);
            return res
                .status(500)
                .json({ message: '게시물 정보를 변경할 수 없습니다.' });
        }
    });
}
function deleteArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { articleId } = req.params;
            const article = yield prisma.article.findUnique({
                where: { id: parseInt(articleId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!article) {
                return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
            }
            if (article.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                return res
                    .status(403)
                    .json({ message: '게시물을 삭제할 권한이 없습니다.' });
            }
            yield prisma.article.delete({ where: { id: parseInt(articleId, 10) } });
            return res.status(200).json({ message: '게시물 삭제 성공' });
        }
        catch (error) {
            console.error('게시물 삭제 중 오류 발생:', error);
            return res.status(500).json({ message: '게시물를 삭제할 수 없습니다.' });
        }
    });
}
function postArticleFavorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { articleId } = req.params;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            if (!articleId) {
                return res.status(400).json({ message: 'Article ID가 필요합니다.' });
            }
            const existingFavorite = yield prisma.favorite.findUnique({
                where: {
                    userId_articleId: {
                        userId: userId,
                        articleId: parseInt(articleId),
                    },
                },
            });
            if (existingFavorite) {
                yield prisma.favorite.delete({
                    where: {
                        id: existingFavorite.id,
                    },
                });
                yield prisma.article.update({
                    where: { id: parseInt(articleId) },
                    data: {
                        favoriteCount: { decrement: 1 },
                    },
                });
                return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
            }
            else {
                yield prisma.favorite.create({
                    data: {
                        user: {
                            connect: { id: userId },
                        },
                        article: {
                            connect: { id: parseInt(articleId) },
                        },
                    },
                });
                yield prisma.article.update({
                    where: { id: parseInt(articleId) },
                    data: {
                        favoriteCount: { increment: 1 },
                    },
                });
                return res.status(200).json({ message: '좋아요가 추가되었습니다.' });
            }
        }
        catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    });
}

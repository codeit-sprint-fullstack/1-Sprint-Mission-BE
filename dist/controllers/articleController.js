"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticles = exports.createArticle = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 게시글 생성
const createArticle = async (req, res, next) => {
    const { title, content, tags, images } = req.body;
    try {
        const article = await prisma.article.create({
            data: {
                title,
                content,
                tags,
                image: images || [],
                userId: req.user?.id,
            },
        });
        res.status(201).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.createArticle = createArticle;
// 게시글 목록 조회
const getArticles = async (req, res, next) => {
    const { page = 1, pageSize = 10, orderBy = "recent", keyword = "" } = req.query;
    let sortBy = {};
    if (orderBy === "recent") {
        sortBy = { createdAt: "desc" };
    }
    else if (orderBy === "like") {
        sortBy = { likes: { _count: "desc" } };
    }
    try {
        const articles = await prisma.article.findMany({
            where: keyword
                ? {
                    OR: [
                        { title: { contains: keyword, mode: "insensitive" } },
                        { content: { contains: keyword, mode: "insensitive" } },
                    ],
                }
                : {},
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: sortBy,
            include: {
                likes: true,
                comments: true,
                user: true,
            },
        });
        res.status(200).json(articles);
    }
    catch (error) {
        next(error);
    }
};
exports.getArticles = getArticles;
// 특정 게시글 조회
const getArticleById = async (req, res, next) => {
    const { articleId } = req.params;
    try {
        const article = await prisma.article.findUnique({
            where: { id: Number(articleId) },
            include: {
                likes: true,
                comments: true,
                user: true,
            },
        });
        if (!article) {
            res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
            return;
        }
        const isLiked = article.likes.some((like) => like.userId === req.user?.id);
        res.status(200).json({ ...article, isLiked });
    }
    catch (error) {
        next(error);
    }
};
exports.getArticleById = getArticleById;
// 게시글 수정
const updateArticle = async (req, res, next) => {
    const { articleId } = req.params;
    const { title, content, tags, images } = req.body;
    try {
        const article = await prisma.article.update({
            where: { id: Number(articleId) },
            data: { title, content, tags, image: images || [] },
        });
        res.status(200).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.updateArticle = updateArticle;
// 게시글 삭제
const deleteArticle = async (req, res, next) => {
    const { articleId } = req.params;
    try {
        await prisma.article.delete({
            where: { id: Number(articleId) },
        });
        res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteArticle = deleteArticle;

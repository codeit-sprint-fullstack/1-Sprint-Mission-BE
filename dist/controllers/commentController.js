"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleComment = exports.deleteProductComment = exports.updateArticleComment = exports.updateProductComment = exports.getArticleComments = exports.getProductComments = exports.createArticleComment = exports.createProductComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 상품에 댓글 추가
const createProductComment = async (req, res, next) => {
    const { content } = req.body;
    const { productId } = req.params;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                productId: Number(productId),
                userId: req.user?.id,
            },
        });
        res.status(201).json(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.createProductComment = createProductComment;
// 게시글에 댓글 추가
const createArticleComment = async (req, res, next) => {
    const { content } = req.body;
    const { articleId } = req.params;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                articleId: Number(articleId),
                userId: req.user?.id,
            },
        });
        res.status(201).json(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.createArticleComment = createArticleComment;
// 상품 댓글 목록 조회
const getProductComments = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { productId: Number(productId) },
            include: { user: true },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductComments = getProductComments;
// 게시글 댓글 목록 조회
const getArticleComments = async (req, res, next) => {
    const { articleId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { articleId: Number(articleId) },
            include: { user: true },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.getArticleComments = getArticleComments;
// 상품 댓글 수정
const updateProductComment = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
            return;
        }
        if (comment.userId !== req.user?.id) {
            res.status(403).json({ error: "본인이 작성한 댓글만 수정할 수 있습니다." });
            return;
        }
        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content },
        });
        res.status(200).json(updatedComment);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductComment = updateProductComment;
// 게시글 댓글 수정
const updateArticleComment = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
            return;
        }
        if (comment.userId !== req.user?.id) {
            res.status(403).json({ error: "본인이 작성한 댓글만 수정할 수 있습니다." });
            return;
        }
        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content },
        });
        res.status(200).json(updatedComment);
    }
    catch (error) {
        next(error);
    }
};
exports.updateArticleComment = updateArticleComment;
// 상품 댓글 삭제
const deleteProductComment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
            return;
        }
        if (comment.userId !== req.user?.id) {
            res.status(403).json({ error: "본인이 작성한 댓글만 삭제할 수 있습니다." });
            return;
        }
        await prisma.comment.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProductComment = deleteProductComment;
// 게시글 댓글 삭제
const deleteArticleComment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
            return;
        }
        if (comment.userId !== req.user?.id) {
            res.status(403).json({ error: "본인이 작성한 댓글만 삭제할 수 있습니다." });
            return;
        }
        await prisma.comment.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteArticleComment = deleteArticleComment;

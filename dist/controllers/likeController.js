"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeArticle = exports.likeArticle = exports.unlikeProduct = exports.likeProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 상품 좋아요 추가
const likeProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const like = await prisma.like.create({
            data: {
                productId: Number(productId),
                userId: req.user?.id,
            },
        });
        res.status(201).json(like);
    }
    catch (error) {
        next(error);
    }
};
exports.likeProduct = likeProduct;
// 상품 좋아요 취소
const unlikeProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        await prisma.like.deleteMany({
            where: {
                productId: Number(productId),
                userId: req.user?.id,
            },
        });
        res.status(200).json({ message: "좋아요가 취소되었습니다." });
    }
    catch (error) {
        next(error);
    }
};
exports.unlikeProduct = unlikeProduct;
// 게시글 좋아요 추가
const likeArticle = async (req, res, next) => {
    const { articleId } = req.params;
    try {
        const like = await prisma.like.create({
            data: {
                articleId: Number(articleId),
                userId: req.user?.id,
            },
        });
        res.status(201).json(like);
    }
    catch (error) {
        next(error);
    }
};
exports.likeArticle = likeArticle;
// 게시글 좋아요 취소
const unlikeArticle = async (req, res, next) => {
    const { articleId } = req.params;
    try {
        await prisma.like.deleteMany({
            where: {
                articleId: Number(articleId),
                userId: req.user?.id,
            },
        });
        res.status(200).json({ message: "좋아요가 취소되었습니다." });
    }
    catch (error) {
        next(error);
    }
};
exports.unlikeArticle = unlikeArticle;

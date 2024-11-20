"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
// 상품 등록
const createProduct = async (req, res, next) => {
    const { name, description, price, tags } = req.body;
    const images = req.body.images || [];
    try {
        const product = await prismaClient_1.default.product.create({
            data: {
                name,
                description,
                price: Number(price),
                tags,
                image: images,
                userId: req.user?.id,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// 상품 목록 조회
const getProducts = async (req, res, next) => {
    const { page = 1, pageSize = 10, orderBy = "recent", keyword = "" } = req.query;
    let sortBy = {};
    if (orderBy === "recent") {
        sortBy = { createdAt: "desc" };
    }
    else if (orderBy === "favorite") {
        sortBy = { likes: { _count: "desc" } };
    }
    try {
        const products = await prismaClient_1.default.product.findMany({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                ],
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: sortBy,
            include: {
                likes: true,
                comments: true,
            },
        });
        const totalCount = await prismaClient_1.default.product.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                ],
            },
        });
        res.status(200).json({ totalCount, list: products });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
// 특정 상품 조회
const getProductById = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const product = await prismaClient_1.default.product.findUnique({
            where: { id: Number(productId) },
            include: {
                likes: { where: { userId: req.user?.id } }, // 좋아요를 필터링
                comments: true,
            },
        });
        if (!product) {
            res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
            return;
        }
        const isFavorite = product.likes.length > 0; // 필터링 결과로 좋아요 여부 확인
        res.status(200).json({ ...product, isFavorite });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
// 상품 수정
const updateProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, price, tags } = req.body;
    const images = req.body.images || [];
    try {
        const product = await prismaClient_1.default.product.update({
            where: { id: Number(productId) },
            data: { name, description, price: Number(price), tags, image: images },
        });
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
// 상품 삭제
const deleteProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        await prismaClient_1.default.product.delete({
            where: { id: Number(productId) },
        });
        res.status(200).json({ id: productId });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;

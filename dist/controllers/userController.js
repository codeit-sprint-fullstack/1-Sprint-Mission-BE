"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavorites = exports.getUserProducts = exports.updatePassword = exports.updateUser = exports.getCurrentUser = void 0;
const client_1 = require("@prisma/client"); // Product를 import
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// 현재 유저 정보 조
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                email: true,
                password: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
// 유저 정보 업데이트
const updateUser = async (req, res, next) => {
    const { image } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: req.user?.id },
            data: { image },
            select: {
                id: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                email: true,
                password: true,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
// 비밀번호 변경
const updatePassword = async (req, res, next) => {
    const { currentPassword, password, passwordConfirmation } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
        });
        if (!user || !(await bcryptjs_1.default.compare(currentPassword, user.password))) {
            res.status(400).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
            return;
        }
        if (password !== passwordConfirmation) {
            res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id: req.user?.id },
            data: { password: hashedPassword },
            select: {
                id: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                email: true,
                password: true,
            },
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
// 유저의 상품 목록 조회
const getUserProducts = async (req, res, next) => {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;
    try {
        const products = await prisma.product.findMany({
            where: {
                userId: req.user?.id,
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                ],
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            include: {
                likes: true,
            },
        });
        const totalCount = await prisma.product.count({
            where: {
                userId: req.user?.id,
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                ],
            },
        });
        res.status(200).json({ totalCount, list: products });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProducts = getUserProducts;
// 유저의 좋아요 상품 목록 조회
const getUserFavorites = async (req, res, next) => {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;
    try {
        const products = await prisma.product.findMany({
            where: {
                likes: {
                    some: {
                        userId: req.user?.id,
                    },
                },
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                ],
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            include: {
                likes: true,
            },
        });
        const totalCount = await prisma.product.count({
            where: {
                likes: {
                    some: {
                        userId: req.user?.id,
                    },
                },
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                ],
            },
        });
        res.status(200).json({ totalCount, list: products });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserFavorites = getUserFavorites;

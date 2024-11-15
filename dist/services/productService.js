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
exports.deleteFavorite = exports.addFavorite = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const index_1 = __importDefault(require("../models/index"));
const parseId = (id) => parseInt(id.toString(), 10);
// 상품 생성
const createProduct = (images, name, price, description, tags, userId, userNickname) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = yield index_1.default.product.create({
        data: {
            images,
            name,
            price,
            description,
            tags,
            ownerId: userId,
            ownerNickname: userNickname,
        },
    });
    return newProduct;
});
exports.createProduct = createProduct;
// 상품 목록 조회
const getProducts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 10, keyword = "", orderBy = "recent") {
    const offset = (page - 1) * pageSize;
    const whereCondition = keyword
        ? {
            OR: [
                { name: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
            ],
        }
        : {};
    const orderCondition = orderBy === "favorite"
        ? [{ favoriteCount: "desc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];
    const [list, totalCount] = yield index_1.default.$transaction([
        index_1.default.product.findMany({
            where: whereCondition,
            skip: offset,
            take: pageSize,
            orderBy: orderCondition,
        }),
        index_1.default.product.count({ where: whereCondition }),
    ]);
    return { list, totalCount, page, pageSize };
});
exports.getProducts = getProducts;
// 특정 상품 조회
const getProductById = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield index_1.default.product.findUnique({
        where: { id: parseId(productId) },
        include: {
            favorites: {
                where: { userId: parseId(userId) },
                select: { id: true },
            },
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    const isFavorite = product.favorites.length > 0;
    return Object.assign(Object.assign({}, product), { isFavorite });
});
exports.getProductById = getProductById;
// 상품 업데이트
const updateProduct = (productId, images, name, price, description, tags, userId, userNickname) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield index_1.default.product.update({
        where: { id: parseId(productId) },
        data: {
            images,
            name,
            price,
            description,
            tags,
            ownerId: userId,
            ownerNickname: userNickname,
        },
    });
    return updatedProduct;
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.default.product.delete({ where: { id: parseId(productId) } });
});
exports.deleteProduct = deleteProduct;
const updateFavorite = (productId_1, ...args_1) => __awaiter(void 0, [productId_1, ...args_1], void 0, function* (productId, increment = true, userId) {
    const existingFavorite = yield index_1.default.favorite.findFirst({
        where: { productId: parseId(productId), userId: parseId(userId) },
    });
    if (increment && existingFavorite) {
        throw new Error("이미 좋아요를 눌렀습니다.");
    }
    else if (!increment && !existingFavorite) {
        throw new Error("좋아요를 누르지 않았습니다.");
    }
    const favoriteAction = increment ? { increment: 1 } : { decrement: 1 };
    const [updatedProduct, favoriteActionResult] = yield index_1.default.$transaction([
        index_1.default.product.update({
            where: { id: parseId(productId) },
            data: { favoriteCount: favoriteAction },
        }),
        increment
            ? index_1.default.favorite.create({
                data: { productId: parseId(productId), userId: parseId(userId) },
            })
            : index_1.default.favorite.delete({
                where: { id: existingFavorite.id },
            }),
    ]);
    return { updatedProduct, favoriteActionResult };
});
const addFavorite = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return updateFavorite(productId, true, userId);
});
exports.addFavorite = addFavorite;
const deleteFavorite = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return updateFavorite(productId, false, userId);
});
exports.deleteFavorite = deleteFavorite;

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
exports.getProducts = getProducts;
exports.postProduct = postProduct;
exports.getProductId = getProductId;
exports.deleteProduct = deleteProduct;
exports.patchProduct = patchProduct;
exports.postFavorites = postFavorites;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 상품 목록 가져오기
function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const skip = (page - 1) * pageSize;
            const orderByField = req.query.orderByField || 'createdAt';
            const orderDir = req.query.orderDir || 'desc';
            const products = yield prisma.product.findMany({
                skip,
                take: pageSize,
                orderBy: { [orderByField]: orderDir },
            });
            return res.status(200).json({ message: '상품 정보 추출', products });
        }
        catch (error) {
            console.error('상품 정보 추출 중 오류 발생:', error);
            return res.status(500).json({ message: '상품 정보를 추출할 수 없습니다.' });
        }
    });
}
// 상품 추가
function postProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, description, price, tags, images } = req.body;
            const { userId } = req.user;
            // `tags` 배열에서 `undefined`, `null`, 빈 문자열을 필터링
            const tagText = Array.isArray(tags)
                ? tags.filter((tag) => typeof tag === 'string' && tag.trim() !== '')
                : [];
            // 가격 파싱 및 검증
            const parsedPrice = parseInt(price, 10);
            if (isNaN(parsedPrice)) {
                return res
                    .status(400)
                    .json({ message: '가격은 유효한 숫자여야 합니다.' });
            }
            // `images` 배열에서 `undefined`, `null`, 빈 문자열을 필터링
            const imagesUrls = Array.isArray(images)
                ? images.filter((image) => typeof image === 'string' && image.trim() !== '')
                : [];
            // Prisma로 데이터베이스에 제품 정보 추가
            const product = yield prisma.product.create({
                data: {
                    name,
                    description,
                    price: parsedPrice,
                    tags: tagText,
                    images: imagesUrls,
                    userId,
                },
            });
            return res.status(201).json({ message: '상품 정보 추가 성공', product });
        }
        catch (error) {
            console.error('상품 정보 추가 중 오류 발생:', error);
            if (error.code === 'P2002') {
                // 중복 오류 처리 (예: 중복된 유저 또는 기타 고유 필드의 중복)
                return res.status(409).json({ message: '중복된 데이터가 있습니다.' });
            }
            return res.status(500).json({ message: '상품 정보를 추가할 수 없습니다.' });
        }
    });
}
// 상품 ID로 정보 가져오기
function getProductId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const product = yield prisma.product.findUnique({
                where: { id: parseInt(productId, 10) },
            });
            return res.status(200).json({ message: '상품 정보 추출', product });
        }
        catch (error) {
            console.error('상품 정보 추출 중 오류 발생:', error);
            return res.status(500).json({ message: '상품 정보를 추출할 수 없습니다.' });
        }
    });
}
// 상품 삭제
function deleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const product = yield prisma.product.findUnique({
                where: { id: parseInt(productId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!product) {
                return res
                    .status(404)
                    .json({ message: '해당 상품이 존재하지 않습니다.' });
            }
            if (product.userId !== req.user.userId) {
                return res
                    .status(403)
                    .json({ message: '해당 상품을 삭제할 권한이 없습니다.' });
            }
            const deletedProduct = yield prisma.product.delete({
                where: { id: parseInt(productId, 10) },
            });
            return res
                .status(200)
                .json({ message: '상품 정보 삭제 성공', deletedProduct });
        }
        catch (error) {
            console.error('상품 정보 삭제 중 오류 발생:', error);
            return res.status(500).json({ message: '상품 정보를 삭제할 수 없습니다.' });
        }
    });
}
// 상품 수정
function patchProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const { name, description, price, tags, images } = req.body;
            const product = yield prisma.product.findUnique({
                where: { id: parseInt(productId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!product) {
                return res
                    .status(404)
                    .json({ message: '해당 상품이 존재하지 않습니다.' });
            }
            if (product.userId !== req.user.userId) {
                return res
                    .status(403)
                    .json({ message: '해당 상품을 수정할 권한이 없습니다.' });
            }
            // 태그 및 이미지 필터링
            const tagText = tags
                ? tags
                    .filter((tag) => tag && tag.text !== undefined)
                    .map((tag) => tag.text)
                : [];
            const imagesUrls = images
                ? images
                    .filter((image) => image && image.url !== undefined)
                    .map((image) => image.url)
                : [];
            // 가격 필터링: undefined 값을 허용하지 않도록 필터링
            const parsedPrice = price !== undefined && price !== null ? parseInt(price, 10) : undefined;
            // 업데이트할 데이터 필터링하여 Prisma가 허용하지 않는 undefined 값이 없도록 처리
            const updateData = {};
            if (name)
                updateData.name = name;
            if (description)
                updateData.description = description;
            if (parsedPrice !== undefined)
                updateData.price = parsedPrice;
            if (tagText.length > 0)
                updateData.tags = tagText;
            if (imagesUrls.length > 0)
                updateData.images = imagesUrls;
            const updatedProduct = yield prisma.product.update({
                where: { id: parseInt(productId, 10) },
                data: updateData,
            });
            return res
                .status(200)
                .json({ message: '상품 정보 변경 성공', updatedProduct });
        }
        catch (error) {
            console.error('상품 정보 변경 중 오류 발생:', error);
            return res.status(500).json({ message: '상품 정보를 변경할 수 없습니다.' });
        }
    });
}
// 좋아요 추가/취소
function postFavorites(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const userId = req.user.userId;
            if (!productId) {
                return res.status(400).json({ message: 'Product ID가 필요합니다.' });
            }
            const existingFavorite = yield prisma.favorite.findUnique({
                where: {
                    userId_productId: {
                        userId: userId,
                        productId: parseInt(productId),
                    },
                },
            });
            if (existingFavorite) {
                // 좋아요 취소
                yield prisma.favorite.delete({
                    where: {
                        id: existingFavorite.id,
                    },
                });
                yield prisma.product.update({
                    where: { id: parseInt(productId) },
                    data: {
                        favoriteCount: { decrement: 1 },
                    },
                });
                return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
            }
            else {
                // 좋아요 추가
                yield prisma.favorite.create({
                    data: {
                        userId: userId,
                        productId: parseInt(productId),
                    },
                });
                yield prisma.product.update({
                    where: { id: parseInt(productId) },
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
exports.default = {
    getProducts,
    postProduct,
    getProductId,
    deleteProduct,
    patchProduct,
    postFavorites,
};

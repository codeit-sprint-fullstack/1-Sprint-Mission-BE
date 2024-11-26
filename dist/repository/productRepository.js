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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductRepository = exports.patchProductRepository = exports.postProductRepository = exports.getProductTotalCountRepository = exports.getProductListRepository = exports.getProductRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    return yield prisma.product.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            images: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            createdAt: true,
            like: true,
        },
    });
});
exports.getProductRepository = getProductRepository;
const getProductListRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ offset, limit, order, search, }) {
    let orderBy;
    switch (order) {
        case "old":
            orderBy = { createdAt: "desc" };
            break;
        case "recent":
            orderBy = { createdAt: "asc" };
            break;
        default:
            orderBy = { createdAt: "asc" };
    }
    return yield prisma.product.findMany({
        skip: offset,
        take: limit,
        orderBy,
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ],
        },
        select: {
            id: true,
            images: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            createdAt: true,
            like: true,
        },
    });
});
exports.getProductListRepository = getProductListRepository;
const getProductTotalCountRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ search, }) {
    return yield prisma.product.count({
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ],
        },
    });
});
exports.getProductTotalCountRepository = getProductTotalCountRepository;
const postProductRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, description, price, tags, imageUrls, }) {
    return yield prisma.product.create({
        data: { name, description, price, tags, images: imageUrls },
    });
});
exports.postProductRepository = postProductRepository;
const patchProductRepository = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { id } = _a, body = __rest(_a, ["id"]);
    return yield prisma.product.update({
        where: { id },
        data: body,
    });
});
exports.patchProductRepository = patchProductRepository;
const deleteProductRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    yield prisma.product.delete({
        where: { id },
    });
});
exports.deleteProductRepository = deleteProductRepository;

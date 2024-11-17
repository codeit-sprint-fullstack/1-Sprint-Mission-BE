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
exports.deleteProductService = exports.patchProductService = exports.postProductService = exports.getProductTotalCountService = exports.getProductListService = exports.getProductService = void 0;
const productRepository_js_1 = require("../repository/productRepository.js");
const getProductService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    return yield (0, productRepository_js_1.getProductRepository)({ id });
});
exports.getProductService = getProductService;
const getProductListService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ offset, limit, order, search, }) {
    return yield (0, productRepository_js_1.getProductListRepository)({ offset, limit, order, search });
});
exports.getProductListService = getProductListService;
const getProductTotalCountService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ search, }) {
    return yield (0, productRepository_js_1.getProductTotalCountRepository)({ search });
});
exports.getProductTotalCountService = getProductTotalCountService;
const postProductService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, description, price, tags, imageUrls, }) {
    return yield (0, productRepository_js_1.postProductRepository)({
        name,
        description,
        price,
        tags,
        imageUrls,
    });
});
exports.postProductService = postProductService;
const patchProductService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, body, }) {
    return yield (0, productRepository_js_1.patchProductRepository)(Object.assign({ id }, body));
});
exports.patchProductService = patchProductService;
const deleteProductService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    return yield (0, productRepository_js_1.deleteProductRepository)({ id });
});
exports.deleteProductService = deleteProductService;

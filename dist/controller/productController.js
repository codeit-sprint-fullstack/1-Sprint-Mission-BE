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
exports.deleteProductController = exports.postProductController = exports.patchProductController = exports.getProductTotalCountController = exports.getProductListController = exports.getProductController = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const productService_1 = require("../service/productService");
exports.getProductController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //??
    const product = yield (0, productService_1.getProductService)({ id });
    res.send(product);
}));
exports.getProductListController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offset = 0, limit = 10, order = "recent", search = "", } = req.query;
    const product = yield (0, productService_1.getProductListService)({
        offset,
        limit,
        order,
        search,
    });
    res.send(product);
}));
exports.getProductTotalCountController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = "" } = req.query;
    const totalCount = yield (0, productService_1.getProductTotalCountService)({ search });
    res.send({ totalCount });
}));
exports.patchProductController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, productService_1.patchProductService)({ id, body: req.body });
    res.send(product);
}));
exports.postProductController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, tags, imageUrls } = req.body;
    const product = yield (0, productService_1.postProductService)({
        name,
        description,
        price,
        tags,
        imageUrls,
    });
    res.send(product);
}));
exports.deleteProductController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, productService_1.deleteProductService)({ id });
    res.send(204);
}));

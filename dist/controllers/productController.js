"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteFavorite = exports.addFavorite = exports.deleteProduct = exports.updateProduct = exports.getProductsById = exports.getProducts = exports.createProduct = void 0;
const productService = __importStar(require("../services/productService.js"));
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files, user } = req;
        // user와 files가 존재하는지 확인
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const images = files ? files.map((file) => file.location) : [];
        const { name, price, description, tags } = req.body;
        const { id: userId, nickname: userNickname } = user;
        const newProduct = yield productService.createProduct(images, name, parseInt(price), description, tags, userId, userNickname);
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", pageSize = "10", keyword = "", orderBy = "recent", } = req.query;
        const { list, totalCount } = yield productService.getProducts(parseInt(page), parseInt(pageSize), keyword, orderBy);
        res.status(200).json({ list, totalCount });
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
const getProductsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (typeof userId !== "number") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const productId = parseInt(req.params.productId);
        const product = yield productService.getProductById(productId, userId);
        res.status(200).json(product);
    }
    catch (err) {
        next(Error);
    }
});
exports.getProductsById = getProductsById;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files } = req;
        const { productId } = req.params;
        const newImagePaths = files
            ? files.map((file) => file.location)
            : [];
        let existingImages = [];
        if (req.body["existingImages"]) {
            if (Array.isArray(req.body["existingImages"])) {
                existingImages = req.body["existingImages"];
            }
            else {
                existingImages = [req.body["existingImages"]];
            }
        }
        const images = [...existingImages, ...newImagePaths];
        const { name, price, description, tags } = req.body;
        const updatedProduct = yield productService.updateProduct(parseInt(productId), images, name, parseInt(price), description, tags);
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error("Error updating product:", error);
        next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield productService.deleteProduct(parseInt(productId));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
const addFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (typeof userId !== "number") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const productId = parseInt(req.params.productId);
        const product = productService.addFavorite(productId, userId);
        res.status(200).json(product);
    }
    catch (err) {
        next(Error);
    }
});
exports.addFavorite = addFavorite;
const deleteFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (typeof userId !== "number") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const productId = parseInt(req.params.productId);
        const product = productService.deleteFavorite(productId, userId);
        res.status(200).json(product);
    }
    catch (err) {
        next(Error);
    }
});
exports.deleteFavorite = deleteFavorite;

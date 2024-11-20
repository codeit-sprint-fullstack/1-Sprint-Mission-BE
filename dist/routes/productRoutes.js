"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// 상품 등록 - 로그인한 사용자만 가능
router.post("/", authMiddleware_1.default, (req, res, next) => {
    (0, productController_1.createProduct)(req, res, next);
});
// 상품 목록 조회
router.get("/", (req, res, next) => {
    (0, productController_1.getProducts)(req, res, next);
});
// 특정 상품 조회
router.get("/:productId", (req, res, next) => {
    (0, productController_1.getProductById)(req, res, next);
});
// 상품 수정 - 로그인한 사용자만 가능
router.patch("/:productId", authMiddleware_1.default, (req, res, next) => {
    (0, productController_1.updateProduct)(req, res, next);
});
// 상품 삭제 - 로그인한 사용자만 가능
router.delete("/:productId", authMiddleware_1.default, (req, res, next) => {
    (0, productController_1.deleteProduct)(req, res, next);
});
exports.default = router;

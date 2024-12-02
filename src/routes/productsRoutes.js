"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middleware/authenticateToken");
const productController_1 = require("../controllers/productController");
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
// 상품 목록 가져오기
router.get('/', (req, res, next) => {
    (0, productController_1.getProducts)(req, res, next);
});
// 상품 등록 (인증 필요)
router.post('/', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, productController_1.postProduct)(req, res, next);
});
router.post('/upload', upload.single('image'), uploadController_1.default);
// 특정 상품 정보 조회
router.get('/:productId', (req, res, next) => {
    (0, productController_1.getProductId)(req, res, next);
});
// 특정 상품 삭제 (인증 필요)
router.delete('/:productId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, productController_1.deleteProduct)(req, res, next);
});
// 특정 상품 수정 (인증 필요)
router.patch('/:productId', authenticateToken_1.authenticateToken, (req, res, next) => {
    (0, productController_1.patchProduct)(req, res, next);
});
// 특정 상품 좋아요 추가/취소 (인증 필요)
router.post('/:productId/favorites', authenticateToken_1.authenticateToken, (req, res) => {
    (0, productController_1.postFavorites)(req, res);
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// 회원가입
router.post('/signup', (req, res, next) => {
    (0, authController_1.signup)(req, res, next);
});
// 로그인
router.post('/login', (req, res, next) => {
    (0, authController_1.login)(req, res, next);
});
// 토큰 갱신
router.post('/refreshToken', (req, res, next) => {
    (0, authController_1.refreshToken)(req, res, next);
});
// 사용자 정보 조회
router.get('/me', authenticateToken_1.authenticateToken, (req, res, next) => {
    const customReq = req; // 타입 단언을 사용해 타입을 CustomRequest로 캐스팅
    (0, userController_1.getUser)(customReq, res, next);
});
exports.default = router;

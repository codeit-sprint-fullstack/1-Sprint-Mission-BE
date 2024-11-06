"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const router = express_1.default.Router();
// 회원가입
router.post("/signUp", validationMiddleware_1.default, (req, res, next) => {
    (0, authController_1.signUp)(req, res, next);
});
// 로그인
router.post("/signIn", validationMiddleware_1.default, (req, res, next) => {
    (0, authController_1.signIn)(req, res, next);
});
exports.default = router;

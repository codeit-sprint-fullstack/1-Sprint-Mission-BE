"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "접근이 거부되었습니다." });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: verified.userId }; // 전역 타입에 저장된 user 정보 가져와서 사용중
        next();
    }
    catch (error) {
        res.status(401).json({ error: "유효한 토큰이 만료되었습니다." });
    }
};
exports.default = authMiddleware;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 회원가입
const signUp = async (req, res, next) => {
    const { email, password, nickname } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                nickname,
                password: hashedPassword,
            },
        });
        // JWT 토큰 발급
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // accessToken과 nickname 반환
        res.status(201).json({ accessToken: token, nickname: user.nickname });
    }
    catch (error) {
        next(error);
    }
};
exports.signUp = signUp;
// 로그인
const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // JWT 토큰 발급
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // accessToken과 nickname 반환
        res.status(200).json({ accessToken: token, nickname: user.nickname });
    }
    catch (error) {
        next(error);
    }
};
exports.signIn = signIn;

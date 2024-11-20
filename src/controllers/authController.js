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
exports.signup = signup;
exports.login = login;
exports.refreshToken = refreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
}
else if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
}
const prisma = new client_1.PrismaClient();
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, nickname, password } = req.body;
            // 이메일 중복 확인
            const existingUser = yield prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
            }
            // 비밀번호 해싱
            const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
            // 사용자 생성
            const user = yield prisma.user.create({
                data: {
                    email,
                    nickName: nickname,
                    encryptedPassword,
                },
            });
            // 액세스 토큰 생성
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
            // 리프레시 토큰 생성
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
            // DB에 리프레시 토큰 저장
            yield prisma.user.update({
                where: { id: user.id },
                data: { refreshToken },
            });
            return res.status(201).json({
                message: '회원가입 성공',
                user: { id: user.id, email: user.email, nickName: user.nickName },
                accessToken,
            });
        }
        catch (error) {
            console.error('회원가입 중 오류:', error);
            next(error);
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // 사용자 확인
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
            }
            // 비밀번호 확인
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.encryptedPassword);
            if (!isPasswordValid) {
                return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
            }
            // 리프레시 토큰 처리
            let refreshToken = user.refreshToken;
            if (refreshToken) {
                try {
                    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                }
                catch (err) {
                    console.log('Refresh token is invalid or expired. Creating a new one.');
                    refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
                    yield prisma.user.update({
                        where: { id: user.id },
                        data: { refreshToken },
                    });
                }
            }
            else {
                refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
                yield prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken },
                });
            }
            // 액세스 토큰 생성
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
            return res.status(200).json({
                message: '로그인 성공',
                user: { id: user.id, email: user.email, nickName: user.nickName },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.error('로그인 오류:', error);
            next(error);
        }
    });
}
function refreshToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: '인증 토큰이 없습니다.' });
            }
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            }
            catch (error) {
                return res
                    .status(403)
                    .json({ message: '유효하지 않은 또는 만료된 토큰입니다.' });
            }
            if (typeof decoded === 'object' && decoded.userId) {
                const user = yield prisma.user.findUnique({
                    where: { id: decoded.userId },
                });
                if (!user) {
                    return res
                        .status(401)
                        .json({ message: '해당 사용자 정보가 없습니다.' });
                }
                if (user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
                const newRefreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
                yield prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken: newRefreshToken },
                });
                return res.status(200).json({
                    message: '토큰 갱신 성공',
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
            else {
                // decoded가 객체가 아니거나 userId가 없는 경우
                return res
                    .status(403)
                    .json({ message: '유효하지 않은 토큰 데이터입니다.' });
            }
        }
        catch (error) {
            console.error('인증 토큰 오류:', error);
            next(error);
        }
    });
}
exports.default = {
    signup,
    login,
    refreshToken,
};

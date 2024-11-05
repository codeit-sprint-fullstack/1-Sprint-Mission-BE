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
exports.refreshToken = exports.getUserByEmail = exports.createUser = void 0;
const index_js_1 = __importDefault(require("../models/index.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (nickname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield index_js_1.default.user.findFirst({
        where: {
            OR: [{ email }, { nickname }],
        },
    });
    if (existingUser) {
        throw new Error("이메일 또는 닉네임이 이미 사용중입니다.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield index_js_1.default.user.create({
        data: { nickname, email, encryptedPassword: hashedPassword },
    });
    const tokens = yield generateAndSaveTokens(newUser);
    return { newUser, tokens };
});
exports.createUser = createUser;
const getUserByEmail = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield index_js_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !(yield bcryptjs_1.default.compare(password, user.encryptedPassword))) {
        throw new Error("이메일과 비밀번호를 다시 확인해주세요");
    }
    const tokens = yield generateAndSaveTokens(user);
    return { user, tokens };
});
exports.getUserByEmail = getUserByEmail;
const generateAndSaveTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const tokens = yield index_js_1.default.auth.create({
        data: {
            user: { connect: { id: user.id } },
            accessToken,
            refreshToken,
            accessTokenExp: getExpirationDate(3),
            refreshTokenExp: getExpirationDate(7, "days"),
        },
    });
    return tokens;
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw new Error("Refresh token not provided");
    try {
        // 1. Refresh token 검증
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // 2. Refresh token의 존재 여부 확인
        const tokenRecord = yield index_js_1.default.auth.findUnique({
            where: { refreshToken },
        });
        if (!tokenRecord)
            throw new Error("Invalid refresh token");
        // 3. 사용자 정보 가져오기
        const user = yield index_js_1.default.user.findUnique({
            where: { id: tokenRecord.userId }, // `userId`는 `auth` 테이블에서 사용자를 식별하는 외래 키라고 가정
        });
        if (!user)
            throw new Error("User not found");
        // 4. 새로운 Access Token 생성
        const newAccessToken = generateAccessToken(user);
        // 5. 인증 정보 업데이트
        yield index_js_1.default.auth.update({
            where: { refreshToken },
            data: {
                accessToken: newAccessToken,
                accessTokenExp: getExpirationDate(3), // 만료일 설정 (예: 3시간)
            },
        });
        // 6. 새로 발급된 토큰과 사용자 정보 반환
        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            user,
        };
    }
    catch (error) {
        console.error("Error refreshing token:", error);
        throw new Error("Invalid or expired refresh token");
    }
});
exports.refreshToken = refreshToken;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3h",
    });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
const getExpirationDate = (time, unit = "hours") => {
    const unitsToMs = {
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + time * unitsToMs[unit]);
};

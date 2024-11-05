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
exports.refreshToken = exports.signIn = exports.signUp = void 0;
const authService = __importStar(require("../services/authService.js"));
const sendAuthResponse = (res, status, message, user, tokens) => {
    if (!user || !tokens) {
        return res.status(400).json({ message: "User or tokens are required" });
    }
    res.status(status).json({
        message,
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
};
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nickname, email, password } = req.body;
        const { newUser, tokens } = yield authService.createUser(nickname, email, password);
        sendAuthResponse(res, 201, "User created successfully", {
            id: newUser.id,
            email: newUser.email,
            nickname: newUser.nickname,
        }, tokens);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, tokens } = yield authService.getUserByEmail(email, password);
        sendAuthResponse(res, 200, "로그인 성공", user, tokens);
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const { accessToken, refreshToken: newRefreshToken, user, } = yield authService.refreshToken(refreshToken);
        sendAuthResponse(res, 200, "리프레시 토큰이 성공적으로 갱신되었습니다.", user, { accessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;

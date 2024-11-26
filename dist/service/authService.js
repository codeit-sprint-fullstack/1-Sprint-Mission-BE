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
exports.loginService = exports.signupService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_ts_1 = __importDefault(require("bcrypt-ts"));
const authRepository_1 = require("../repository/authRepository");
const JWT_SECRET = (process.env.JWT_SECRET || "mini1018");
const REFRESH_SECRET = (process.env.REFRESH_SECRET || "mini1018");
const signupService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, nickname, }) {
    const existingUser = yield (0, authRepository_1.findUserEmailRepository)({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = yield bcrypt_ts_1.default.hash(password, 10);
    return yield (0, authRepository_1.createUserRepository)({
        email,
        encryptedPassword: hashedPassword,
        nickname,
    });
});
exports.signupService = signupService;
const loginService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield (0, authRepository_1.findUserEmailRepository)({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = yield bcrypt_ts_1.default.compare(password, user.encryptedPassword);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken, user };
});
exports.loginService = loginService;

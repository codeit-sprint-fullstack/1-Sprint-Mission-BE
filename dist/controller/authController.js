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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
const authService_1 = require("../service/authService");
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, nickname } = req.body;
    try {
        const newUser = yield (0, authService_1.signupService)({ email, password, nickname });
        res.status(201).json({
            message: "회원가입 성공",
            user: newUser,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.signupController = signupController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const token = yield (0, authService_1.loginService)({ email, password });
        res.status(200).json({
            message: "로그인 성공",
            token,
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.loginController = loginController;

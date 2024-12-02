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
exports.getUser = getUser;
const client_1 = require("@prisma/client");
const env_1 = __importDefault(require("../env"));
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: env_1.default.baseUrl,
        },
    },
});
// 사용자 정보 조회
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const user = yield prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    nickName: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }
            // 사용자 정보를 클라이언트에 반환
            return res.status(200).json({
                message: '사용자 정보 조회 성공',
                user,
            });
        }
        catch (error) {
            console.error('사용자 정보 조회 중 오류 발생:', error);
            return res
                .status(500)
                .json({ message: '사용자 정보를 조회할 수 없습니다.' });
        }
    });
}

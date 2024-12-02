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
exports.getComments = getComments;
exports.postComment = postComment;
exports.deleteComment = deleteComment;
exports.patchComment = patchComment;
const client_1 = require("@prisma/client");
const env_1 = __importDefault(require("../env"));
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: env_1.default.baseUrl,
        },
    },
});
// 댓글 목록 가져오기
function getComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId, articleId } = req.params;
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const skip = (page - 1) * pageSize;
            const whereCondition = {};
            if (productId) {
                whereCondition.productId = parseInt(productId, 10);
            }
            else if (articleId) {
                whereCondition.articleId = parseInt(articleId, 10);
            }
            else {
                return res
                    .status(400)
                    .json({ message: 'productId 또는 articleId가 필요합니다.' });
            }
            const comments = yield prisma.comment.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            id: true,
                            nickName: true,
                            image: true,
                        },
                    },
                },
            });
            return res.status(200).json({ message: '댓글 목록 추출', comments });
        }
        catch (error) {
            console.error('댓글 정보 추출 중 오류 발생:', error);
            next(error);
        }
    });
}
// 댓글 작성
function postComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId, articleId } = req.params;
            const { content } = req.body;
            const { user } = req;
            if (!user) {
                return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
            }
            const { userId } = user;
            // productId 또는 articleId 중 하나는 필수
            if (!productId && !articleId) {
                return res
                    .status(400)
                    .json({ message: 'productId 또는 articleId가 필요합니다.' });
            }
            // 댓글 데이터 생성
            const commentData = {
                content,
                userId,
                productId: productId ? parseInt(productId, 10) : null,
                articleId: articleId ? parseInt(articleId, 10) : null,
            };
            const comment = yield prisma.comment.create({
                data: commentData,
            });
            return res.status(201).json({ message: '댓글 추가 성공', comment });
        }
        catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            next(error);
        }
    });
}
// 댓글 삭제
function deleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            const { user } = req;
            if (!user) {
                return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
            }
            // 댓글 존재 여부 확인
            const comment = yield prisma.comment.findUnique({
                where: { id: parseInt(commentId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!comment) {
                return res
                    .status(404)
                    .json({ message: '해당 댓글이 존재하지 않습니다.' });
            }
            // 사용자가 댓글을 삭제할 권한이 있는지 확인
            if (comment.userId !== user.userId) {
                return res
                    .status(403)
                    .json({ message: '해당 댓글을 삭제할 권한이 없습니다.' });
            }
            // 댓글 삭제
            const deletedComment = yield prisma.comment.delete({
                where: { id: parseInt(commentId, 10) },
            });
            return res.status(200).json({ message: '댓글 삭제 성공', deletedComment });
        }
        catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            next(error);
        }
    });
}
// 댓글 수정
function patchComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            const { user } = req;
            if (!user) {
                return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
            }
            // 댓글 존재 여부 확인
            const comment = yield prisma.comment.findUnique({
                where: { id: parseInt(commentId, 10) },
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!comment) {
                return res
                    .status(404)
                    .json({ message: '해당 댓글이 존재하지 않습니다.' });
            }
            // 사용자가 댓글을 수정할 권한이 있는지 확인
            if (comment.userId !== user.userId) {
                return res
                    .status(403)
                    .json({ message: '해당 댓글을 수정할 권한이 없습니다.' });
            }
            // 댓글 수정
            const updatedComment = yield prisma.comment.update({
                where: { id: parseInt(commentId, 10) },
                data: { content },
            });
            return res.status(200).json({ message: '댓글 변경 성공', updatedComment });
        }
        catch (error) {
            console.error('댓글 변경 중 오류 발생:', error);
            next(error);
        }
    });
}
exports.default = {
    getComments,
    postComment,
    deleteComment,
    patchComment,
};

import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../controllers/marketCommentController.js"; // 컨트롤러에서 함수 가져오기
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import authMiddleware from "../../middlewares/authMiddleware.js"; // 인증 미들웨어 import

const router = express.Router(); // API 경로 정의

// 중고마켓 댓글 목록 조회 API 및 등록 API
router.route("/").get(getComments).post(authMiddleware, createComment);

// 중고마켓 댓글 수정 API
router.patch("/:id", authMiddleware, updateComment);

// 중고마켓 댓글 삭제 API
router.delete("/:id", authMiddleware, deleteComment);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

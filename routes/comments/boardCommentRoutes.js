import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../controllers/boardCommentController.js"; // 컨트롤러에서 함수 가져오기
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import

const router = express.Router(); // API 경로 정의

// 자유게시판 댓글 목록 조회 API
router.get("/", getComments);

// 자유게시판 댓글 등록 API
router.post("/", createComment);

// 자유게시판 댓글 수정 API
router.patch("/:id", updateComment);

// 자유게시판 댓글 삭제 API
router.delete("/:id", deleteComment);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

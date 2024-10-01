import express from "express";
import { PrismaClient } from "@prisma/client";
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import

const prisma = new PrismaClient();
const router = express.Router();

// 자유게시판 댓글 목록 조회 API
router.get("/", async (req, res, next) => {
  const { cursor = "", limit = 20 } = req.query;

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옴
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
        boardType: "board", // 자유게시판 댓글로 필터링
      },
      orderBy: { id: "asc" }, // id를 기준으로 오름차순 정렬
      take: Number(limit), // 요청한 댓글 수만큼 가져옴
      select: {
        id: true,
        content: true,
        createdAt: true,
        articleId: true, // 자유게시판 게시글 ID
        user: { select: { nickname: true } }, // 작성자의 닉네임을 포함
      },
    });

    res.status(200).send(comments);
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
});

// 자유게시판 댓글 등록 API
router.post("/", async (req, res, next) => {
  const { content, articleId, userId } = req.body; // userId 추가

  // 데이터 검증
  if (!content || !articleId || !userId) {
    return res.status(400).send({
      error: "댓글 내용을 입력해주세요. 게시글 ID와 사용자 ID를 입력해주세요.",
    });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        articleId, // 자유게시판 게시글 ID
        userId, // 사용자 ID
        boardType: "board",
      },
    });

    res.status(201).send(newComment);
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
});

// 자유게시판 댓글 수정 API
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params; // 댓글 ID
  const { content } = req.body; // 수정할 내용

  if (!content) {
    return res.status(400).send({ error: "댓글 내용을 입력해주세요." });
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id_boardType: {
          id: parseInt(id),
          boardType: "board", // 자유게시판 댓글로 필터링
        },
      },
      data: { content }, // 새로운 내용으로 업데이트
    });

    res.status(200).send(updatedComment);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    console.error("댓글 수정 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
});

// 자유게시판 댓글 삭제 API
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params; // 댓글 ID

  try {
    const deletedComment = await prisma.comment.deleteMany({
      where: {
        id: parseInt(id),
        boardType: "board", // 자유게시판 댓글로 필터링
      },
    });

    if (deletedComment.count === 0) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    res.status(200).send({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

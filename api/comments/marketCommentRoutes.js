import express from "express";
import { PrismaClient } from "@prisma/client";
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import authMiddleware from "../../middlewares/authMiddleware.js"; // 인증 미들웨어 import

const prisma = new PrismaClient();
const router = express.Router();

// 중고마켓 댓글 목록 조회 API
router.get("/", async (req, res, next) => {
  // next 추가
  // "/api/market/comments"에 해당
  const { cursor = "", limit = 15, postId } = req.query; // postId 추가

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옵니다.
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    // 데이터의 개수 확인을 위한 추가 쿼리
    const totalCount = await prisma.comment.count({
      where: {
        boardType: "market",
        postId: postId ? parseInt(postId) : undefined, // postId 필터링 추가
      },
    });

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
        boardType: "market",
        postId: postId ? parseInt(postId) : undefined,
      },
      orderBy: { id: "asc" }, // id를 기준으로 오름차순 정렬
      take: Number(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        userId: true,
      }, // 작성자 ID 포함
    });

    res.status(200).json({ totalCount, comments }); // 응답 형식 변경
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
});

// 중고마켓 댓글 등록 API
router.post("/", authMiddleware, async (req, res, next) => {
  // next 추가
  // "/api/market/comments"에 해당
  const { content, postId } = req.body;

  // 데이터 검증
  if (!content || !postId) {
    return res.status(400).json({ error: "댓글 내용을 입력해주세요." });
  }

  try {
    // 게시글 존재 여부 확인
    const postExists = await prisma.marketPost.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        boardType: "market",
        userId: req.user.id, // 로그인한 사용자의 ID 추가
      },
    });

    res.status(201).json(newComment); // 응답 형식 변경
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
});

// 중고마켓 댓글 수정 API
router.patch("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    // 댓글이 존재하는지 확인
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("댓글 수정 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
});

// 중고마켓 댓글 삭제 API
router.delete("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    // 댓글이 존재하는지 확인
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

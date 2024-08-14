import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// 중고마켓 댓글 목록 조회 API
router.get("/api/market/comments", async (req, res) => {
  const { cursor = "", limit = 15 } = req.query;

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옵니다.
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    // 데이터의 개수 확인을 위한 추가 쿼리
    const totalCount = await prisma.comment.count({
      where: { boardType: "market" },
    });

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
        boardType: "market",
      },
      orderBy: { id: "asc" }, // id를 기준으로 오름차순 정렬
      take: Number(limit),
      select: { id: true, content: true, createdAt: true, postId: true },
    });

    res.status(200).send(totalCount, comments);
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 목록을 불러오는 데 실패했습니다." });
  }
});

// 중고마켓 댓글 등록 API
router.post("/api/board/comments", async (req, res) => {
  const { content, postId } = req.body;

  // 데이터 검증
  if (!content || !postId) {
    return res.status(400).send({ error: "댓글 내용을 입력해주세요." });
  }
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        boardType: "market",
      },
    });

    res.status(201).send(newComment);
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 등록을 실패했습니다." });
  }
});

export default router;

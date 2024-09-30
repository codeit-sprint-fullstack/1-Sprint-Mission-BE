import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// 자유게시판 댓글 목록 조회 API
router.get("/", async (req, res) => {
  const { cursor = "", limit = 20 } = req.query;

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옴
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
        boardType: "board",
      },
      orderBy: { id: "asc" }, // id를 기준으로 오름차순 정렬
      take: Number(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        author: true,
      },
    });

    res.status(200).send(comments);
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 목록을 불러오는 데 실패했습니다." });
  }
});

// 자유게시판 댓글 등록 API
router.post("/", async (req, res) => {
  const { content, postId, author } = req.body; // author 추가

  // 데이터 검증
  if (!content || !postId || !author) {
    // author 검증 추가
    return res
      .status(400)
      .send({ error: "댓글 내용을 입력해주세요. 작성자를 입력해주세요." });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        author, // author 추가
        boardType: "board",
      },
    });

    res.status(201).send(newComment);
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 등록을 실패했습니다." });
  }
});

// 자유게시판 댓글 수정 API
router.patch("/:id", async (req, res) => {
  const { id, boardType } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ error: "댓글 내용을 입력해주세요." });
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id_boardType: {
          id: parseInt(id),
          boardType: "board",
        },
      },
      data: { content },
    });

    res.status(200).send(updatedComment);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    console.error("댓글 수정 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 수정을 실패했습니다." });
  }
});

// 자유게시판 댓글 삭제 API
router.delete("/:id", async (req, res) => {
  const { id, boardType } = req.params;

  try {
    const deletedComment = await prisma.comment.deleteMany({
      where: {
        id: parseInt(id),
        boardType: "board",
      },
    });

    if (deletedComment.count === 0) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    res.status(200).send({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    res.status(500).send({ error: "댓글 삭제를 실패했습니다." });
  }
});

export default router;

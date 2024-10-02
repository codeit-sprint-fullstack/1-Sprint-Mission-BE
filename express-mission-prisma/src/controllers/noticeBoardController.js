import express from "express";
import { asyncHandler } from "../app"; // 임시

const noticeBoardController = express.Router();

// 게시글 목록 조회
noticeBoardController.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "recent",
      keyWord = "",
    } = req.query;
    const pageNum = page || 1;
    const pageSizeNum = pageSize || 4;
    const offset = (pageNum - 1) * pageSizeNum;
    const whereOr = {
      OR: [
        {
          title: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
      ],
    };

    const noticeBoard = await prisma.noticeBoard.findMany({
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(pageSizeNum),
      where: whereOr,
    });
    const count = await prisma.noticeBoard.count({ where: whereOr });
    const [list, total] = await Promise.all([noticeBoard, count]);

    res.send({ total, list });
  })
);

// 게시글 상세 조회
noticeBoardController.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const noticeBoard = await prisma.noticeBoard.findUniqueOrThrow({
      where: { id },
    });
    res.send(noticeBoard);
  })
);

// 게시글 생성
noticeBoardController.post(
  "/",
  asyncHandler(async (req, res) => {
    assert(req.body, s.CreateNoticeBoard);
    const noticeBoard = await prisma.noticeBoard.create({
      data: req.body,
    });
    res.status(201).send(noticeBoard);
  })
);

// 게시글 수정
noticeBoardController.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    assert(req.body, s.PatchNoticeBoard);
    const noticeBoard = await prisma.noticeBoard.update({
      where: { id },
      data: req.body,
    });
    res.status(201).send(noticeBoard);
  })
);

// 게시글 삭제
noticeBoardController.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.noticeBoard.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

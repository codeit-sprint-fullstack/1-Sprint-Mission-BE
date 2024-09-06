import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import * as s from "./struct.js";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(asyncFunc) {
  return async function (req, res) {
    try {
      await asyncFunc(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/*-----------------게시글-------------------*/
app.get(
  "/noticeBoards",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "recent",
      keyWord = "",
    } = req.query;
    const pageNum = page || 1
    const pageSizeNum = pageSize || 4
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
      include: {
        user: true
      }
    });
    const count = await prisma.noticeBoard.count({ where: whereOr });
    const [list, total] = await Promise.all([noticeBoard, count]);

    res.send({ total, list });
  })
);

app.get(
  "/noticeBoards/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const noticeBoard = await prisma.noticeBoard.findUniqueOrThrow({
      where: { id },
      include: {
        user: true
      }
    });
    res.send(noticeBoard);
  })
);

app.post(
  "/noticeBoards",
  asyncHandler(async (req, res) => {
    assert(req.body, s.CreateNoticeBoard);
    const noticeBoard = await prisma.noticeBoard.create({
      data: req.body,
      include: {
        user: true
      }
    });
    res.status(201).send(noticeBoard);
  })
);

app.patch(
  "/noticeBoards/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    assert(req.body, s.PatchNoticeBoard);
    const noticeBoard = await prisma.noticeBoard.update({
      where: { id },
      data: req.body,
      include: {
        user: true
      }
    });
    res.status(201).send(noticeBoard);
  })
);

app.delete(
  "/noticeBoards/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.noticeBoard.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

/*-----------------자유게시판 댓글-------------------*/
app.get(
  "/freeCommends",
  asyncHandler(async (req, res) => {
    const { cursor = "", pageSize = 2, orderBy = "recent" } = req.query;
    const skipInt = cursor === "" ? 0 : 1;
    const findValueDefault = {
      orderBy: { createdAt: "desc" },
      skip: parseInt(skipInt),
      take: parseInt(pageSize),
      include: {
        user: true
      }
    };
    const findValue =
      cursor !== ""
        ? { ...findValueDefault, cursor: { id: cursor } }
        : { ...findValueDefault };

    const freeCommend = await prisma.freeCommend.findMany(findValue);
    const count = await prisma.freeCommend.count();
    const [list, total] = await Promise.all([freeCommend, count]);

    const lastList = list[pageSize - 1];
    const NextCusor = lastList ? lastList.id : "null";

    res.send({
      cursorInfo: {
        total,
        NextCusor,
      },
      list,
    });
  })
);

app.get(
  "/freeCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freeCommend = await prisma.freeCommend.findUniqueOrThrow({
      where: { id },
    });
    res.send(freeCommend);
  })
);

app.post(
  "/freeCommends",
  asyncHandler(async (req, res) => {
    assert(req.body, s.CreateFreeCommend);
    const freeCommend = await prisma.freeCommend.create({
      data: req.body,
      include: {
        user: true
      }
    });
    res.status(201).send(freeCommend);
  })
);

app.patch(
  "/freeCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    assert(req.body, s.PatchCommend);
    const freeCommend = await prisma.freeCommend.update({
      where: { id },
      data: req.body,
      include: {
        user: true
      }
    });
    res.status(201).send(freeCommend);
  })
);

app.delete(
  "/freeCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.freeCommend.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

/*-----------------중고마켓 댓글-------------------*/
app.get(
  "/usedCommends",
  asyncHandler(async (req, res) => {
    const { cursor = "", pageSize = 2, orderBy = "recent" } = req.query;
    const skipInt = cursor === "" ? 0 : 1;
    const findValueDefault = {
      orderBy: { createdAt: "desc" },
      skip: parseInt(skipInt),
      take: parseInt(pageSize),
    };
    const findValue =
      cursor !== ""
        ? { ...findValueDefault, cursor: { id: cursor } }
        : { ...findValueDefault };

    const usedCommend = await prisma.usedCommend.findMany(findValue);
    const count = await prisma.usedCommend.count();
    const [list, total] = await Promise.all([usedCommend, count]);

    const lastList = list[pageSize - 1];
    const NextCusor = lastList ? lastList.id : "null";

    res.send({
      cursorInfo: {
        total,
        NextCusor,
      },
      list,
    });
  })
);

app.get(
  "/usedCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const usedCommend = await prisma.usedCommend.findUniqueOrThrow({
      where: { id },
    });
    res.send(usedCommend);
  })
);

app.post(
  "/usedCommends",
  asyncHandler(async (req, res) => {
    assert(req.body, s.CreateUsedCommend);
    const usedCommend = await prisma.usedCommend.create({
      data: req.body,
    });
    res.status(201).send(usedCommend);
  })
);

app.patch(
  "/usedCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    assert(req.body, s.PatchCommend);
    const usedCommend = await prisma.usedCommend.update({
      where: { id },
      data: req.body,
    });
    res.status(201).send(usedCommend);
  })
);

app.delete(
  "/usedCommends/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.usedCommend.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

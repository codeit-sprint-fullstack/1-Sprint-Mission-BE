import express from "express";
import * as dotenv from "dotenv";
import { PrismaClient, Prisma } from "@prisma/client";
import cors from "cors";

dotenv.config(); // 환경 변수를 불러옵니다.
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
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

// 댓글 상태 변경 API (삭제됨 또는 신고됨으로 설정)
app.patch(
  "/comments/:id/status",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status는 "active", "deleted", "flagged" 중 하나로 설정할 수 있습니다.

    // 유효한 상태인지 확인
    if (!["active", "deleted", "flagged"].includes(status)) {
      return res.status(400).send({ message: "Invalid status value" });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        status,
      },
    });

    res.send(comment);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  };
}
app.get("/", (req, res) => {
  res.send("default path");
});
// 게시글 조회
app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (article) {
      res.send(article);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 게시글 등록
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);
// 게시글 수정
app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const article = await prisma.article.update({
        where: { id: id },
        data: req.body,
      });
      res.send(article);
    } catch (error) {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 게시글 삭제
app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const article = await prisma.article.delete({
        where: { id: id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);
// 상품 목록 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;
    const sort = "recent"; // 최신순만 구현
    const sortOption = { createdAt: sort === "recent" ? "desc" : "asc" };

    const searchQuery = keyword
      ? {
          $or: [
            { name: { $regex: keyword } },
            { description: { $regex: keyword } },
          ],
        }
      : {};

    const totalProducts = await Product.countDocuments(searchQuery);
    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .skip(offset)
      .limit(Number(pageSize))
      .select("id name description price createdAt");

    const result = await res.send({ totalProducts, products });
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

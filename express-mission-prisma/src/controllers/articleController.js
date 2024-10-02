import express from "express";
import { asyncHandler } from "../app"; // 임시

const articleController = express.Router();

articleController
  .route("/")
  .get(
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

      const article = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        skip: parseInt(offset),
        take: parseInt(pageSizeNum),
        where: whereOr,
      });
      const count = await prisma.article.count({ where: whereOr });
      const [list, total] = await Promise.all([article, count]);

      res.send({ total, list });
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, s.CreateNoticeBoard);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(article);
    })
  );


articleController
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
      });
      res.send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assert(req.body, s.PatchNoticeBoard);
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

export default articleController
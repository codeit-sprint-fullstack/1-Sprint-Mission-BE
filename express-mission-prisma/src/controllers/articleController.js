import express from "express";
import articleService from "../services/articleService.js";
import asyncHandler from "../services/errorService.js";

const articleController = express.Router();

articleController
  .route("/")
  .post(
    asyncHandler(async (req, res, next) => {
      console.log("1111");
      console.log(req.body);
      const article = await articleService.create(req.body);
      res.status(201).send(article);
    })
  )
  .get(
    asyncHandler(async (req, res, next) => {
      const {
        page = 1,
        pageSize = 10,
        orderBy = "recent",
        keyWord = "",
      } = req.query;

      const pageNum = page || 1;
      const pageSizeNum = pageSize || 4;

      const order = orderBy || "recent";
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

      const fillter = {
        orderBy: { createdAt: "desc" },
        skip: parseInt(offset),
        take: parseInt(pageSizeNum),
        where: whereOr,
      };

      const articles = await articleService.getAllByFilter(fillter);
      const count = await articleService.countByFilter(fillter.where);
      const [list, total] = await Promise.all([articles, count]);

      return res.send({ total, list });
    })
  );

articleController
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await articleService.getById(id);
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

export default articleController;

import express from "express";
import { asyncHandler } from "../app";

const commentController = express.Router();
const articleCommentController = express.Router();
const productCommentCotroller = express.Router();

articleCommentController
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const { cursor = "", pageSize = 5, orderBy = "recent" } = req.query;
      const { id } = req.params;
      const skipInt = cursor === "" ? 0 : 1;
      const findValueDefault = {
        orderBy: { createdAt: "desc" },
        skip: parseInt(skipInt),
        take: parseInt(pageSize),
        where: { noticeBoardId: id },
      };
      const findValue =
        cursor !== ""
          ? { ...findValueDefault, cursor: { id: cursor } }
          : { ...findValueDefault };

      const freeCommend = await prisma.freeCommend.findMany(findValue);
      const count = await prisma.freeCommend.count({
        where: { noticeBoardId: id },
      });
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
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, s.CreateFreeCommend);
      const freeCommend = await prisma.freeCommend.create({
        data: req.body,
      });
      res.status(201).send(freeCommend);
    })
  );

productCommentCotroller
  .route("/")
  .get(
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
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, s.CreateUsedCommend);
      const usedCommend = await prisma.usedCommend.create({
        data: req.body,
      });
      res.status(201).send(usedCommend);
    })
  );

commentController
  .route("/")
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assert(req.body, s.PatchCommend);
      const freeCommend = await prisma.freeCommend.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(freeCommend);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.freeCommend.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

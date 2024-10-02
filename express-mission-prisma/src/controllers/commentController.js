import express from "express";
import asyncHandler from "../services/errorService.js";
import articleCommentService from "../services/articleCommentService.js";

const commentController = express.Router(); // 수정 및 삭제를 위한 router
const articleCommentController = express.Router(); // 게시글 댓글 router
const productCommentCotroller = express.Router(); // 상품 댓글 router

articleCommentController
  .route("/:id/comment")
  .post(
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const comment = await articleCommentService.create(id, req.body);
      res.status(201).send(comment);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { pageSize = 5 } = req.query;
      const freeCommend = await articleCommentService.getAllByFilter(
        id,
        req.query
      );
      const count = await articleCommentService.countByFilter(id);
      const [list, total] = await Promise.all([freeCommend, count]);

      const lastList = list[pageSize || 5];
      const NextCusor = lastList ? lastList.id : "null";
      list.pop();

      res.send({
        cursorInfo: {
          total,
          NextCusor,
        },
        list,
      });
    })
  );

productCommentCotroller
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, s.CreateUsedCommend);
      const usedCommend = await prisma.usedCommend.create({
        data: req.body,
      });
      res.status(201).send(usedCommend);
    })
  )
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

export { commentController, articleCommentController, productCommentCotroller };

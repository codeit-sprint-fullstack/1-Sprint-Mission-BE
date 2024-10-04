import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import articleController from "./src/controllers/articleController.js";
import {
  articleCommentController,
  commentController,
  productCommentCotroller,
} from "./src/controllers/commentController.js";
import productController from "./src/controllers/productController.js";
import errorHandler from "./src/middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads'))

app.use("/article", articleController);
app.use("/article", articleCommentController);
app.use('/product', productCommentCotroller)
app.use('/comment', commentController)
app.use('/product', productController)

app.use(errorHandler)

app.listen(process.env.PORT || 3001, () => console.log("Server Started"));


/*-----------------게시글-------------------*/
// app.get(
//   "/noticeBoards",
//   asyncHandler(async (req, res) => {
//     const {
//       page = 1,
//       pageSize = 10,
//       orderBy = "recent",
//       keyWord = "",
//     } = req.query;
//     const pageNum = page || 1
//     const pageSizeNum = pageSize || 4
//     const offset = (pageNum - 1) * pageSizeNum;
//     const whereOr = {
//       OR: [
//         {
//           title: {
//             contains: keyWord,
//             mode: "insensitive",
//           },
//         },
//         {
//           content: {
//             contains: keyWord,
//             mode: "insensitive",
//           },
//         },
//       ],
//     };

//     const noticeBoard = await prisma.noticeBoard.findMany({
//       orderBy: { createdAt: "desc" },
//       skip: parseInt(offset),
//       take: parseInt(pageSizeNum),
//       where: whereOr,
//     });
//     const count = await prisma.noticeBoard.count({ where: whereOr });
//     const [list, total] = await Promise.all([noticeBoard, count]);

//     res.send({ total, list });
//   })
// );

// app.get(
//   "/noticeBoards/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const noticeBoard = await prisma.noticeBoard.findUniqueOrThrow({
//       where: { id },
//     });
//     res.send(noticeBoard);
//   })
// );

// app.post(
//   "/noticeBoards",
//   asyncHandler(async (req, res) => {
//     assert(req.body, s.CreateNoticeBoard);
//     const noticeBoard = await prisma.noticeBoard.create({
//       data: req.body,
//     });
//     res.status(201).send(noticeBoard);
//   })
// );

// app.patch(
//   "/noticeBoards/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     assert(req.body, s.PatchNoticeBoard);
//     const noticeBoard = await prisma.noticeBoard.update({
//       where: { id },
//       data: req.body,
//     });
//     res.status(201).send(noticeBoard);
//   })
// );

// app.delete(
//   "/noticeBoards/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     await prisma.noticeBoard.delete({
//       where: { id },
//     });
//     res.sendStatus(204);
//   })
// );

/*-----------------자유게시판 댓글-------------------*/
// app.get(
//   "/noticeBoards/:id/freeCommends",
//   asyncHandler(async (req, res) => {
//     const { cursor = "", pageSize = 5, orderBy = "recent" } = req.query;
//     const {id} = req.params
//     const skipInt = cursor === "" ? 0 : 1;
//     const findValueDefault = {
//       orderBy: { createdAt: "desc" },
//       skip: parseInt(skipInt),
//       take: parseInt(pageSize),
//       where: { noticeBoardId: id}
//     };
//     const findValue =
//       cursor !== ""
//         ? { ...findValueDefault, cursor: { id: cursor } }
//         : { ...findValueDefault };

//     const freeCommend = await prisma.freeCommend.findMany(findValue);
//     const count = await prisma.freeCommend.count({where: { noticeBoardId: id}});
//     const [list, total] = await Promise.all([freeCommend, count]);

//     const lastList = list[pageSize - 1];
//     const NextCusor = lastList ? lastList.id : "null";

//     res.send({
//       cursorInfo: {
//         total,
//         NextCusor,
//       },
//       list,
//     });
//   })
// );

// app.get(
//   "/freeCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const freeCommend = await prisma.freeCommend.findUniqueOrThrow({
//       where: { id },
//     });
//     res.send(freeCommend);
//   })
// );

// app.post(
//   "/freeCommends",
//   asyncHandler(async (req, res) => {
//     assert(req.body, s.CreateFreeCommend);
//     const freeCommend = await prisma.freeCommend.create({
//       data: req.body,
//     });
//     res.status(201).send(freeCommend);
//   })
// );

// app.patch(
//   "/freeCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     assert(req.body, s.PatchCommend);
//     const freeCommend = await prisma.freeCommend.update({
//       where: { id },
//       data: req.body,
//     });
//     res.status(201).send(freeCommend);
//   })
// );

// app.delete(
//   "/freeCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     await prisma.freeCommend.delete({
//       where: { id },
//     });
//     res.sendStatus(204);
//   })
// );

/*-----------------중고마켓 댓글-------------------*/
// app.get(
//   "/usedCommends",
//   asyncHandler(async (req, res) => {
//     const { cursor = "", pageSize = 2, orderBy = "recent" } = req.query;
//     const skipInt = cursor === "" ? 0 : 1;
//     const findValueDefault = {
//       orderBy: { createdAt: "desc" },
//       skip: parseInt(skipInt),
//       take: parseInt(pageSize),
//     };
//     const findValue =
//       cursor !== ""
//         ? { ...findValueDefault, cursor: { id: cursor } }
//         : { ...findValueDefault };

//     const usedCommend = await prisma.usedCommend.findMany(findValue);
//     const count = await prisma.usedCommend.count();
//     const [list, total] = await Promise.all([usedCommend, count]);

//     const lastList = list[pageSize - 1];
//     const NextCusor = lastList ? lastList.id : "null";

//     res.send({
//       cursorInfo: {
//         total,
//         NextCusor,
//       },
//       list,
//     });
//   })
// );

// app.get(
//   "/usedCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const usedCommend = await prisma.usedCommend.findUniqueOrThrow({
//       where: { id },
//     });
//     res.send(usedCommend);
//   })
// );

// app.post(
//   "/usedCommends",
//   asyncHandler(async (req, res) => {
//     assert(req.body, s.CreateUsedCommend);
//     const usedCommend = await prisma.usedCommend.create({
//       data: req.body,
//     });
//     res.status(201).send(usedCommend);
//   })
// );

// app.patch(
//   "/usedCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     assert(req.body, s.PatchCommend);
//     const usedCommend = await prisma.usedCommend.update({
//       where: { id },
//       data: req.body,
//     });
//     res.status(201).send(usedCommend);
//   })
// );

// app.delete(
//   "/usedCommends/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     await prisma.usedCommend.delete({
//       where: { id },
//     });
//     res.sendStatus(204);
//   })
// );

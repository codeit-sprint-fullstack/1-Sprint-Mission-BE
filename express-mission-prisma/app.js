import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

/*-----------------게시글-------------------*/
app.get("/noticeBoard", async (req, res) => {
  const noticeBoard = await prisma.noticeBoard.findMany();
  res.send(noticeBoard);
});

app.get("/noticeBoards/:id", async (req, res) => {
  const { id } = req.params;
  const noticeBoard = await prisma.noticeBoard.findUnique({
    where: { id },
  });
  res.send(noticeBoard);
});

app.post("/noticeBoards", async (req, res) => {
  const noticeBoard = await prisma.noticeBoard.create({
    data: req.body,
  });
  res.status(201).send(noticeBoard);
});

app.patch("/noticeBoards/:id", async (req, res) => {
  const { id } = req.params;
  const noticeBoard = await prisma.noticeBoard.update({
    where: { id },
    data: req.body,
  });
  res.status(201).send(noticeBoard);
});

app.delete("/noticeBoards/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.noticeBoard.delete({
    where: { id },
  });
  res.sendStatus(204);
});

/*-----------------자유게시판 댓글-------------------*/
app.get("/freeCommends", async (req, res) => {
  const freeCommend = await prisma.freeCommend.findMany();
  res.send(freeCommend);
});

app.get("/freeCommends/:id", async (req, res) => {
  const { id } = req.params;
  const freeCommend = await prisma.freeCommend.findUnique({
    where: { id },
  });
  res.send(freeCommend);
});

app.post("/freeCommends", async (req, res) => {
  const freeCommend = await prisma.freeCommend.create({
    data: req.body,
  });
  res.status(201).send(freeCommend);
});

app.patch("/freeCommends/:id", async (req, res) => {
  const { id } = req.params;
  const freeCommend = await prisma.freeCommend.update({
    where: { id },
    data: req.body,
  });
  res.status(201).send(freeCommend);
});

app.delete("/freeCommends/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.freeCommend.delete({
    where: { id },
  });
  res.sendStatus(204);
});

/*-----------------중고마켓 댓글-------------------*/
app.get("/usedCommends", async (req, res) => {
  const usedCommend = await prisma.usedCommend.findMany();
  res.send(usedCommend);
});

app.get("/usedCommends/:id", async (req, res) => {
  const { id } = req.params;
  const usedCommend = await prisma.usedCommend.findUnique({
    where: { id },
  });
  res.send(usedCommend);
});

app.post("/usedCommends", async (req, res) => {
  const usedCommend = await prisma.usedCommend.create({
    data: req.body,
  });
  res.status(201).send(usedCommend);
});

app.patch("/usedCommends/:id", async (req, res) => {
  const { id } = req.params;
  const usedCommend = await prisma.usedCommend.update({
    where: { id },
    data: req.body,
  });
  res.status(201).send(usedCommend);
});

app.delete("/usedCommends/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.usedCommend.delete({
    where: { id },
  });
  res.sendStatus(204);
});

/*-----------------유저-------------------*/
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
});

app.post("/users", async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
});

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.status(201).send(user);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

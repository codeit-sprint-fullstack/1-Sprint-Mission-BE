import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../errorUtils.js";

const app = express.Router();
const prisma = new PrismaClient();

app.get(
  "/",
  asyncHandle(async (req, res) => {
    const { orderby = "", offset = 0, limit = 5, keyword = "" } = req.query;
    let orderbyQuery;
    switch (orderby) {
      case "resent":
        orderbyQuery = { createAt: "asc" };
        break;
      case "oldset":
        orderbyQuery = { createAt: "desc" };
        break;
      case "name":
        orderbyQuery = { name: "asc" };
        break;
      default:
        orderbyQuery = { createAt: "asc" };
        break;
    }
    const whereConditions = {};
    if (keyword) {
      whereConditions.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { email: { contains: keyword, mode: "insensitive" } },
      ];
    }
    const data = await prisma.user.findMany({
      where: whereConditions,
      skip: offset * limit,
      take: limit,
      orderBy: orderbyQuery,
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "사용자를 찾을수 없습니다." });
    }
  })
);

export default app;

import express from "express";
import { asyncHandle } from "../errorUtils.js";
import { PrismaClient } from "@prisma/client";

const app = express.Router();
const prisma = new PrismaClient();

app.get(
  "/",
  asyncHandle(async (req, res) => {
    const {
      orderBy,
      limit = 10,
      offset = 1,
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      date = "",
    } = req.query;
    const page = (offset - 1) * limit; //page가 3이면 3-1 = 2 * count 만큼 스킵
    const regex = new RegExp(keyword, "i"); // 대소문자 구분 안 함
    const dateQuery = {};
    if (date) {
      const startDate = new Date(date);
      dateQuery.createAt = { $gt: startDate.getTime() };
    }
    let orderOption;
    switch (orderBy) {
      case "recent":
        orderOption = { createAt: "desc" };
        break;
      case "favorite":
        orderOption = { favorite: "desc" };
        break;
      default:
        orderOption = { createAt: "desc" };
        break;
    }
    //promise.all를 사용해서 동시에 기다려보자...
    const [totalCount, products] = await prisma.$transaction([
      prisma.product.count({ where: regex }),
      prisma.product.findMany({
        take: limit, //추가적인 이 있는지 확인
        skip: limit * page, //커서 자신을 스킵하기 위함
        orderBy: orderOption,
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          comment: {
            include: {
              user: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      }),
    ]);

    if (products) {
      const responseData = {
        list: products,
        totalCount: totalCount,
      };
      res.send(responseData);
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

app.get(
  "/:id",
  asyncHandle(async (req, res) => {
    const id = req.params.id;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        comment: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

app.patch(
  "/:id",
  asyncHandle(async (req, res) => {
    assert(req.body, updateArticle);
    const { id } = req.params;
    const data = await prisma.product.update({
      where: { id },
      data: req.body,
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        comment: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

app.delete(
  "/:id",
  asyncHandle(async (req, res) => {
    const { id } = req.params;
    const data = await prisma.product.delete({
      where: { id },
    });

    if (data) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

export default app;

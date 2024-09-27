import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import { PrismaClient } from "@prisma/client";
import { getProducts } from "../service/productService.js";

const app = express.Router();
const prisma = new PrismaClient();

app.get(
  "/",
  asyncHandle(async (req, res) => {
    try {
      const { totalCount, products, hasMore } = await getProducts(req.query);
      if (products) {
        const responseData = {
          list: products,
          totalCount: totalCount,
          hasMore,
        };
        return res.send(responseData);
      } else {
        return res.status(404).send({ message: "등록된 상품이 없습니다." });
      }
    } catch (error) {
      return res.status(404).send({ message: "등록된 상품이 없습니다." });
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

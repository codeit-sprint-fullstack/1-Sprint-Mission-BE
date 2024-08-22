import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log(e.name);
      console.log(e.message);
    }
  };
}

app.get(
  "/product",
  asyncHandler(async (req, res) => {
    const { keywrod, page = 1, pageSize = 10 } = req.query;
    try {
      const conditions = keywrod
        ? {
            OR: [
              {
                name: {
                  contains: keywrod,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: keywrod,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {};
      const products = await prisma.product.findMany({
        where: conditions,
        orderBy: {
          createAt: "asc",
        },
        skip: (page - 1) * pageSize,
        take: parseInt(pageSize),
        select: {
          id: true,
          name: true,
          description: true,
          createAt: true,
        },
      });
      const totalProducts = await prisma.product.count({ where: conditions });
      res.json({
        data: products,
        total: totalProducts,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalProducts / pageSize),
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "internal server error" });
    }
  })
);

app.post("/product", async (req, res) => {
  try {
    const { name, description, price, tag } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tag: Array.isArray(tag) ? tag : [tag],
      },
    });
    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.patch("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, tag } = req.body;
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        tag: Array.isArray(tag) ? tag : [tag],
      },
    });
    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.post("/product/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }
    const comment = await prisma.productComment.create({
      data: {
        content,
        productId: id,
      },
    });
    res.status(201).send(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.patch("/product/:id/comment/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  const { content } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }
    const comment = await prisma.productComment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
    res.status(201).send(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/product/:id/comment/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }
    const comment = await prisma.productComment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(201).send(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});

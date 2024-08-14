import * as dotenv from "dotenv";
import express from "express";
import cors from "cors"; //  서로 다른 IP에 위치한 클라이언트와 서버가 데이터를 주고 받을 수 있게 만듦
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "./struct.js";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e.code === "P2025" &&
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  })
);

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findMany();

    res.send(product);
  })
);

app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
    });
    res.send(product);
  })
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const id = parseInt(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(product);
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.listen(3000, () => console.log("Server is running"));

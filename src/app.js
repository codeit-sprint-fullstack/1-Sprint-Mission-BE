import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import Product from "./models/product.js";

const app = express();

app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}
// 상품 목록 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const sort = "recent"; // 최신순만 구현
    const sortOption = { createdAt: sort === "recent" ? "desc" : "asc" };

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search } },
            { description: { $regex: search } },
          ],
        }
      : {};

    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .skip(offset)
      .limit(Number(limit))
      .select("id name price createdAt");

    const result = await res.send(products);
  })
);
// 상품 상세 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);

    res.status(201).send(newProduct);
  })
);
// 상품 수정
app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

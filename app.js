import mongoose from "mongoose";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import Product from "./models/Product.js";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));
const app = express();

// const corsOptions = {
//   origin: ["http://127.0.0.1:5500", "https://my-todo.com"],
// };

app.use(cors());
app.use(express.json());

// 에러 처리 함수
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id. " });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// CRUD 연산
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort === "recent" ? "desc" : "asc";
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: sort })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.send({ list: products, totalCount });
  })
);

app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

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
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

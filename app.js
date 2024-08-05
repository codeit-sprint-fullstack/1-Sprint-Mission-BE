import mongoose from "mongoose";
import { DATABASE_URL, PORT } from "./env.js";
import express from "express";
import Product from "./models/product.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));

function resHandle(callback) {
  return async function (req, res) {
    try {
      await callback(req, res);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };
}

const asyncHandel = (handle) => (req, res, next) => {
  handle(req, res, next).catch();
};

//product
app.get(
  "/products",
  asyncHandel(async (req, res) => {
    const {
      order,
      pageSize = 10,
      page = 1,
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      date = "",
    } = req.query;

    const offset = (page - 1) * pageSize; //page가 3이면 3-1 = 2 * count 만큼 스킵
    const regex = new RegExp(keyword, "i"); // 대소문자 구분 안 함
    const dateQuery = {};
    if (date) {
      const startDate = new Date(date);
      dateQuery.createAt = { $gt: startDate.getTime() };
    }
    const orderOption = { createAt: order === "recent" ? "asc" : "desc" };

    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
      price: { $gt: Number(minPrice), $lt: Number(maxPrice) },
      ...dateQuery,
    })
      .sort(orderOption)
      .skip(offset)
      .limit(pageSize);
    const totalCount = await Product.countDocuments();
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
  "/products/:id",
  asyncHandel(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

app.post(
  "/products",
  resHandle(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  })
);

app.patch(
  "/products/:id",
  asyncHandel(async (req, res) => {
    const id = req.params.id;
    const object = req.body;
    const product = await Product.findById(id);
    if (product) {
      Object.keys(object).forEach((key) => {
        product[key] = object[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

app.listen(PORT, () => console.log("Server Started"));

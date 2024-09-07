import mongoose from "mongoose";
import express from "express";
import Product from "../models/product.js";
import { asyncHandle } from "../errorUtils.js";

const app = express.Router();

app.get(
  "/",
  asyncHandle(async (req, res) => {
    const {
      order,
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
    const orderOption = { createAt: order === "recent" ? "asc" : "desc" };

    //1차 시도 하지만 await를 2번하여 느리다.
    // const products = await Product.find({
    //   $or: [{ name: regex }, { description: regex }],
    //   price: { $gt: Number(minPrice), $lt: Number(maxPrice) },
    //   ...dateQuery,
    // })
    //   .sort(orderOption)
    //   .skip(offset)
    //   .limit(limit);
    // const totalCount = await Product.countDocuments();

    //promise.all를 사용해서 동시에 기다려보자...
    const [products, totalCount] = await Promise.all([
      Product.find({
        $or: [{ name: regex }, { description: regex }],
        price: { $gt: Number(minPrice), $lt: Number(maxPrice) },
        ...dateQuery,
      })
        .sort(orderOption)
        .skip(page)
        .limit(limit),
      Product.countDocuments({
        $or: [{ name: regex }, { description: regex }],
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
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

app.post(
  "/",
  asyncHandle(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  })
);

app.patch(
  "//:id",
  asyncHandle(async (req, res) => {
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

app.delete(
  "/:id",
  asyncHandle(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.status(204).send({ message: "상품을 삭제했습니다" });
    } else {
      res.status(404).send({ message: "등록된 상품이 없습니다." });
    }
  })
);

export default app;

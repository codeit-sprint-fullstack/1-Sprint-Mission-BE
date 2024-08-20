import express from "express";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(asyncFunc) {
  return async function (req, res) {
    try {
      await asyncFunc(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find give id" });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

function chackId(newData, method, body = '') {
  if (newData) {
    const valuesData = newData;

    if (method === "get") {
      const valuesStatus = 200;
      return { valuesData, valuesStatus };

    } else if (method === 'delete') {
      const valuesStatus = 204
      return { valuesData, valuesStatus };
    }

  } else {
    const valuesStatus = 404;
    const valuesData = { message: "Cannot find give id" };
    return { valuesData, valuesStatus };
  }
}

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    /*
    쿼리 파라미터
    order: 'favorite'인 경우 favorite가 많은 순
    pagesiZe: 가져 올 갯수
    */
    const order = req.query.order;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offSet = (page - 1) * pageSize || 0;
    const keyWord = req.query.keyword || "";

    const orderOption =
      order === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

    const findOption = {
      $or: [
        { name: { $regex: `${keyWord}`, $options: "i" } },
        { description: { $regex: `${keyWord}`, $options: "i" } },
      ],
    };

    const newData = await Product.find(findOption)
      .sort(orderOption)
      .skip(offSet)
      .limit(pageSize);

    const totalCount = await Product.find(findOption).countDocuments();

    res.send({ list: newData, totalCount: totalCount });
  })
);

app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findById(id);

    const { valuesData, valuesStatus } = chackId(newData, 'get');

    res.status(valuesStatus).send(valuesData);
  })
);

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const product = new Product(req.body);

    await product.validate();

    await product.save();

    res.status(201).send(product);
  })
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findById(id);

    if (!newData) {
      return res.status(404).send({ message: "Cannot find give id" })
    }

    Object.assign(newData, req.body)

    await newData.validate()
    
    await newData.save()

    res.status(200).send(newData)
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findByIdAndDelete(id);

    const { valuesData, valuesStatus } = chackId(newData, 'delete');

    res.status(valuesStatus).send(valuesData);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

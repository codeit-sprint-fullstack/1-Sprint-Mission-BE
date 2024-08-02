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

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    /*
    쿼리 파라미터
    order: 'favorite'인 경우 favorite가 많은 순
    pagesiZe: 가져 올 갯수
    */
    const order = req.query.order;
    const pageSize = Number(req.query.pageSize) || 0;
    const offSet = Number(req.query.offset) || 0;
    const keyWord = req.query.keyword || "";

    const orderOption =
      order === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

    const newData = await Product.find({
      $or: [
        { name: { $regex: `${keyWord}`, $options: "i" } },
        { description: { $regex: `${keyWord}`, $options: "i" } },
      ],
    })
      .sort(orderOption)
      .skip(offSet)
      .limit(pageSize);

    const totalCount = await Product.find().countDocuments()


    res.send([...newData, {"totalCount": totalCount}]);
  })
);

app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findById(id);

    if (newData) {
      res.send(newData);
    } else {
      res.status(404).send({ message: "Cannot find give id" });
    }
  })
);

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const newPushData = await Product.create(req.body);
    res.status(201).send(newPushData);
  })
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findById(id);

    if (newData) {
      Object.keys(req.body).forEach((key) => {
        newData[key] = req.body[key];
      });
      newData.save();
      res.send(newData);
    } else {
      res.status(404).send({ message: "Cannot find give id" });
    }
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newData = await Product.findByIdAndDelete(id);

    if (newData) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find give id" });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

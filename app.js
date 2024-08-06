import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import cors from "cors";

dotenv.config();
console.log(process.env.DATABASE_URL);
console.log("testtesttest");
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Database connected");
});
const app = express();
app.use(cors());
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
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;

      const products = await Product.find().skip(startIndex).limit(limit);

      const totalCount = await Product.countDocuments();

      res.send({ product: products, totalCount, page, limit });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  })
);

app.post(
  "/product",
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  })
);

app.patch(
  "/product/:id",
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
      res.status(404).send({ message: "Product not found" });
    }
  })
);

app.delete(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});

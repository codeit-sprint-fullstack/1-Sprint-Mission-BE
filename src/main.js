import express from "express";
import { DB_URL, PORT } from "../src/config.js";
import mongoose from "mongoose";
import {
  SampleData,
  Product,
  User,
  UserFavorites,
  ProductFavorites,
} from "../data/Product.js";

const app = express();

app.use(express.json());

/** Product POST /Products -테스트 완 - 임시 테이블에 연결*/
app.post("/products", async (req, res) => {
  const { images, tags, price, description, name } = req.body;
  // 임시로 사용자 id를 Authorization 값 사용
  const { authorization } = req.headers;

  // 테스트를 위해 임시로 schema에 _id 추가
  let newId = (await SampleData.find({})).length + 1;

  const newProduct = new SampleData({
    _id: newId,
    name: name,
    description: description,
    price: price,
    tag: tags,
    images: images,
    ownerId: authorization,
    favoriteCount: 0,
  });

  const result = await newProduct.save();

  if (result) {
    res.status(200);
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

/** Product GET /Products - 테스트 완 - 임시 테이블에 연결*/
app.get("/products", async (req, res) => {
  const { page, pageSize, orderBy, keyword } = req.query;

  let keywordOption = {};
  const orderByOption = {};
  let pageOption = 0;
  let pageSizeOption = 10;

  if (keyword) {
    const castStringKeyword = keyword.toString();

    keywordOption = {
      $or: [
        { name: { $regex: castStringKeyword, $options: "i" } },
        { description: { $regex: castStringKeyword, $options: "i" } },
      ],
    };
  }

  if (orderBy && orderBy.toString() === "favorite") {
    orderByOption.favoriteCount = -1;
  } else {
    orderByOption.createdAt = -1;
  }

  if (pageSize) {
    pageSizeOption = Number(pageSize);
  }

  if (page) {
    pageOption = (Number(page) - 1) * pageSizeOption;
  }

  const product = await SampleData.find(keywordOption)
    .sort(orderByOption)
    .skip(pageOption)
    .limit(pageSizeOption);

  let result = product;
  if (result[0]._id) {
    for (const element of result) {
      element.ownerId = undefined;
      element.updatedAt = undefined;
      element.__v = undefined;
    }
  }

  res.json(result);
});

/** Product GET /products/:id - 테스트 완 - 임시 테이블에 연결*/
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const castId = Number(id);

  const product = await SampleData.findById(castId);

  let result = product;

  if (product) {
    result.ownerId = undefined;
    result.updatedAt = undefined;
    result.__v = undefined;

    res.status(200);
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

/** Product PATCH /products/:id - 테스트 완 - 임시 테이블에 연결 */
app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const updateData = req.body;
  const castId = Number(id);

  // 임시
  const ownerId = await SampleData.findById(castId).ownerId;

  let result = null;

  if (authorization === ownerId) {
    result = await SampleData.findByIdAndUpdate({ _id: castId }, updateData);
    if (result) {
      res.status(200);
    } else {
      res.status(404);
      result = { message: "Not Found" };
    }
  } else {
    res.status(401);
    result = { message: "Unauthorized" };
  }

  res.json(result);
});

/** Product DELETE /products/:id - 테스트 완 - 임시 테이블에 연결 */
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const castId = Number(id);

  const result = await SampleData.findByIdAndDelete({ _id: castId });

  if (result) {
    res.status(200);
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

mongoose
  .connect(`${DB_URL}`)
  .then(() => {
    console.log("DB connected");

    const server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

    const shutdown = () => {
      server.close(() => {
        console.log("Server closed");

        mongoose
          .disconnect()
          .then(() => {
            console.log("Disconnected from DB");
            process.exit(0);
          })
          .catch((err) => {
            console.error("Error disconnecting from DB", err);
            process.exit(1);
          });
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((err) => {
    console.log(`Error connecting DB : ${err.name}`);
    process.exit(1);
  });

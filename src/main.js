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

  let filterData = await SampleData.find({});

  let filterPage = 0;
  let filterPageSize = 10;

  if (keyword) {
    const castStringKeyword = keyword.toString();

    filterData = filterData.filter(
      (product) => product?.name?.toString().indexOf(castStringKeyword) === true
    );
  }

  if (orderBy && orderBy.toString() === "favorite") {
    filterData = filterData.toSorted(
      (a, b) => b.favoriteCount - a.favoriteCount
    );
  } else {
    filterData = filterData.toSorted((a, b) => b.createdAt - a.createdAt);
  }

  if (page) {
    filterPage = Number(page) - 1;
  }

  if (pageSize) {
    filterPageSize = Number(pageSize);
  }

  filterData = filterData.slice(filterPage * filterPageSize, filterPageSize);

  res.json(filterData);
});

/** Product GET /products/:id - 테스트 완 - 임시 테이블에 연결*/
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const castId = Number(id);

  const product = await SampleData.findById(castId);

  let result = product;

  if (product) {
    res.status(200);
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

/** Product PATCH /products/:id - 테스트 완 - 임시 테이블에 연결 */
// 이건 문제가 body를 분해 안해서 다른 속성도 마음껏 수정되는 문제가 있음
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
    }
  } else {
    res.status(401);
    result = { message: "Unauthorized" };
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
      mongoose
        .disconnect()
        .then(() => {
          console.log("Disconnected from MongoDB");
          server.close(() => {
            console.log("HTTP server closed");
          });
        })
        .catch((err) => {
          console.error("Error disconnecting from MongoDB", err);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((err) => {
    console.log(`Error connecting DB : ${err.name}`);
    process.exit(1);
  });

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

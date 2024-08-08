import express from "express";
import cors from "cors";
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

app.use(cors());
app.use(express.json());

/** Product POST /Products -테스트 완 - 임시 테이블에 연결*/
app.post("/products", async (req, res) => {
  const { images, tag, price, description, name } = req.body;
  // 임시로 사용자 id를 Authorization 값 사용
  const { authorization } = req.headers;

  // 테스트를 위해 임시로 schema에 _id 추가
  let newId = (await SampleData.find({})).length + 1;

  const newProduct = new SampleData({
    _id: newId,
    name: name,
    description: description,
    price: price,
    tag: tag,
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
  let result = null;

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

  const products = await SampleData.find(keywordOption)
    .sort(orderByOption)
    .skip(pageOption)
    .limit(pageSizeOption)
    .lean();

  const totalCount = await SampleData.find(keywordOption).countDocuments();

  // if (products[0]._id) {
  //   for (const element of products) {
  //     // element.ownerId = undefined;
  //     // element.description = undefined;
  //     element.tag = undefined;
  //     element.createdAt = undefined;
  //     element.updatedAt = undefined;
  //     element.__v = undefined;

  //     delete element.ownerId;
  //     delete element.description;
  //   }
  // }

  const newList = products.map((item) => {
    const { ownerId, description, tag, createdAt, updatedAt, __v, ...rest } =
      item;
    return rest;
  });

  result = {
    list: newList,
    totalCount: totalCount,
  };

  res.json(result);
});

/** Product GET /products/:id - 테스트 완 - 임시 테이블에 연결*/
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const castId = Number(id);
  let result = null;

  const product = await SampleData.findById(castId).lean();

  if (product) {
    const { ownerId, updatedAt, __v, ...rest } = product;
    result = rest;

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
  const editableProperties = ["images", "tag", "price", "description", "name"];
  const updateData = req.body;
  let updateDataCopy = JSON.parse(JSON.stringify(updateData));
  let result = null;
  const castId = Number(id);

  for (const key of editableProperties) {
    delete updateDataCopy[`${key}`];
  }

  if (Object.keys(updateDataCopy).length > 0) {
    res.status(400);
    result = { message: "Bad Request" };
  } else {
    // 임시
    const ownerId = await SampleData.findById(castId).ownerId;

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
  }

  res.json(result);
});

/** Product DELETE /products/:id - 테스트 완 - 임시 테이블에 연결 */
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const castId = Number(id);
  let result = null;

  const product = await SampleData.findById(castId);

  if (product.ownerId) {
    console.log("product.ownerId : " + product.ownerId);
    if (authorization == Number(product.ownerId)) {
      console.log("???");
      res.status(200);
      result = await SampleData.findByIdAndDelete({ _id: castId });
    } else {
      res.status(401);
      result = { message: "Unauthorized" };
    }
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
      // server.close(async () => {
      server.close(() => {
        console.log("Server closed");

        // try {
        //   await mongoose.disconnect();
        //   console.log("Disconnected from DB");
        // } catch (err) {
        //   console.error("Error disconnecting from DB", err);
        // }
        mongoose
          .disconnect()
          .then(() => {
            console.log("Disconnected from DB");
          })
          .catch((err) => {
            console.error("Error disconnecting from DB", err);
          })
          .finally(() => {
            console.log("fianl");
          });
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((err) => {
    console.log(`Error connecting DB : ${err.name}`);
  });

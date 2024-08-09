import express from "express";
import cors from "cors";
import { DB_URL, PORT } from "./config.js";
import mongoose from "mongoose";
import { SampleData, Product, User } from "../data/MongooseSchema.js";

const app = express();

app.use(cors());
app.use(express.json());

/** User GET /user/me */
app.get("/users/me", async (req, res) => {
  const { authorization } = req.headers;
  const castId = Number(authorization);
  let result = null;

  // 임시로 사용자 id로 사용자 정보 검색
  const user = await User.findById(castId).lean();

  if (user) {
    const { name, password, _id, ...rest } = user;

    res.status(200);
    result = { id: _id, ...rest };
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

/** User PATCH /user/me */
app.patch("/users/me", async (req, res) => {
  const { image } = req.body;
  // 임시로 사용자 id 토큰으로 사용
  const { authorization } = req.headers;
  let result = null;

  const user = await User.updateOne(
    { _id: authorization },
    { image: image },
    { runValidators: true }
  ).lean();

  if (user) {
    const { name, email, password, _id, ...rest } = user;

    res.status(200);
    result = { id: _id, ...rest };
  } else {
    res.status(400);
    result = { message: "Error" };
  }

  res.json(result);
});

/** User PATCH /user/me/password */
app.patch("/users/me/password", async (req, res) => {
  const { passwordConfirmation, password, currentPassword } = req.body;
  const { authorization } = req.headers;
  let result = null;

  if (passwordConfirmation === password) {
    const user = await User.findById(authorization).lean();

    res.status(400);
    result = { message: "incorrect password confirmation" };

    if (user) {
      if (user.password === currentPassword) {
        const user_ = await User.updateOne(
          { _id: authorization },
          { password: password },
          { runValidators: true }
        );

        if (user_) {
          const { name, email, password, _id, ...rest } = user;

          res.status(200);
          result = { id: _id, ...rest };
        } else {
          res.status(404);
          result = { message: "check you account" };
        }
      } else {
        res.status(400);
        result = { message: "Password incorrect" };
      }
    }
  }

  res.json(result);
});

/** User GET /user/me/products */
app.get("/users/me/products", async (req, res) => {
  const { authorization } = req.headers;
  let result = null;

  const products = await Product.find({ ownerId: authorization }).lean();

  if (products) {
    const totalCount = products.length;
    const list = products.map((product) => {
      const { _id, updatedAt, favorite_user_id, ...rest } = product;
      const favoriteCount = favorite_user_id.length;

      return { id: _id, favoriteCount: favoriteCount, ...rest };
    });

    res.status(200);
    result = { totalCount: totalCount, list: list };
  } else {
    res.status(400);
    result = { message: "Error" };
  }

  res.json(result);
});

/** User GET /user/me/favorites */
app.get("/user/me/favorites", async (req, res) => {
  const { authorization } = req.headers;
  let result = null;

  const favorites = await Product.find({
    favorite_user_id: { $elemMatch: authorization },
  }).lean();

  if (favorites) {
    const totalCount = favorites.length;
    const list = favorites.map((product) => {
      const { _id, updatedAt, favorite_user_id, ...rest } = product;
      const favoriteCount = favorite_user_id.length;

      return { id: _id, favoriteCount: favoriteCount, ...rest };
    });

    res.status(200);
    result = { totalCount: totalCount, list: list };
  } else {
    res.status(400);
    result = { message: "Error" };
  }
});

/** Product POST /products -테스트 완*/
app.post("/products", async (req, res) => {
  const { images, tags, price, description, name } = req.body;
  // 임시로 사용자 id를 authorization 값 사용
  const { authorization } = req.headers;
  let result = null;

  const newProduct = new Product({
    name: name,
    description: description,
    price: price,
    tags: tags,
    images: images,
    ownerId: authorization,
    favorite_user_id: [],
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const insertedProduct = await newProduct.save();
    const { _id, favorite_user_id, updatedAt, __v, ...rest } =
      insertedProduct.toObject();
    const favoriteCount = favorite_user_id.length;

    result = { id: _id, favoriteCount: favoriteCount, ...rest };
    if (result.id) {
      res.status(200);

      await User.findOneAndUpdate(
        { _id: authorization },
        { $push: { products: result._id } },
        { runValidators: true }
      );
    } else {
      res.status(400);
      result = { message: "Error" };
    }

    await session.commitTransaction();
  } catch (err) {
    res.status(500);
    result = { message: err.name };
    await session.abortTransaction();
  } finally {
    session.endSession();
  }

  res.json(result);
});

/** Product GET /Products - 테스트 완 */
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

  // const product = await Product.find(keywordOption)
  //   .sort(orderByOption)
  //   .skip(pageOption)
  //   .limit(pageSizeOption)
  //   .lean();
  const product = await Product.aggregate([
    { $addFields: { favoriteCount: { $size: "$favorite_user_id" } } },
    { $match: keywordOption },
    { $sort: orderByOption },
    { $skip: pageOption },
    { $limit: pageSizeOption },
  ]);

  const totalCount = await Product.find(keywordOption)
    .sort(orderByOption)
    .countDocuments();

  const list = product.map((item) => {
    const {
      _id,
      ownerId,
      description,
      tags,
      favorite_user_id,
      createdAt,
      updatedAt,
      __v,
      ...rest
    } = item;
    // const favoriteCount = favorite_user_id.length;

    return { id: _id, ...rest };
  });

  result = {
    list: list,
    totalCount: totalCount,
  };

  res.json(result);
});

/** Product GET /products/:id - 테스트 완 */
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  let result = null;

  const product = await Product.findById(id).lean();

  if (product) {
    const { _id, ownerId, updatedAt, favorite_user_id, __v, ...rest } = product;
    const favoriteCount = favorite_user_id.length;

    res.status(200);
    result = { id: _id, favoriteCount: favoriteCount, ...rest };
  } else {
    res.status(404);
    result = { message: "Not Found" };
  }

  res.json(result);
});

/** Product PATCH /products/:id - 테스트 완 */
app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const editableProperties = ["images", "tags", "price", "description", "name"];
  const updateData = req.body;
  let updateDataCopy = JSON.parse(JSON.stringify(updateData));
  let result = null;

  for (const key of editableProperties) {
    delete updateDataCopy[`${key}`];
  }

  if (Object.keys(updateDataCopy).length > 0) {
    res.status(400);
    result = { message: "Bad Request" };
  } else {
    // 임시
    const product = await Product.findById(id);

    if (authorization === product.ownerId.toString()) {
      const { _id, favorite_user_id, updatedAt, __v, ...rest } =
        await Product.findByIdAndUpdate({ _id: id }, updateData, {
          new: true,
        }).lean();
      const favoriteCount = favorite_user_id.length;
      const newProduct = { id: _id, favoriteCount: favoriteCount, ...rest };

      if (newProduct.id) {
        result = newProduct;
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

/** Product DELETE /products/:id - 테스트 완 */
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  let result = null;

  const product = await Product.findById(id);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (product) {
      if (authorization === product.ownerId.toString()) {
        res.status(200);
        // 해당 상품 삭제
        const deletedProduct = await Product.findByIdAndDelete({
          _id: id,
        });
        // user에 favorite products 정보 저장시 사용 예정
        // const users_favorite = deletedProduct.favorite_user_id;
        // const users_id = { _id: { $in: users_favorite } };
        // result = deletedProduct;

        // // favorite 관련 api 구현 후 테스트 필요
        // // favorite_user_id에 저장된 user id를 기반으로 user의
        // await User.updateMany(users_id, {
        //   $pull: { favorite_products: deletedProduct._id },
        // });

        // 상품을 올린 유저의 상품 정보에서 제거
        await User.findByIdAndUpdate(
          { _id: product.ownerId.toString() },
          { $pull: { products: id } },
          { runValidators: true }
        );
        const { _id, updatedAt, __v, favorite_user_id, ...rest } =
          deletedProduct.toObject();
        const favoriteCount = favorite_user_id.length;

        result = { id: _id, favoriteCount: favoriteCount, ...rest };
      } else {
        res.status(401);
        result = { message: "Unauthorized" };
      }
    } else {
      res.status(404);
      result = { message: "Not Found" };
    }
    await session.commitTransaction();
  } catch (err) {
    res.status(500);
    result = { message: err.name };
    await session.abortTransaction();
  } finally {
    session.endSession();
  }

  res.json(result);
});

/** /resetProductsOfUser/:id 테스트 용 */
app.patch("/resetProductsOfUser/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  let result = await User.findByIdAndUpdate(
    { _id: id },
    { products: [] },
    {
      new: true,
    }
  );

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

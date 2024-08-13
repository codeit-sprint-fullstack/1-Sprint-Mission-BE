import { DB_URL } from "../src/config.js";

import mongoose from "mongoose";
import { productsData, userData } from "./mock.js";
import { SampleData, Product, User } from "./MongooseSchema.js";

try {
  await mongoose.connect(`${DB_URL}`);
  console.log("success connect mongoose");

  // await User.deleteMany({});
  // await User.insertMany(userData);

  const newMock = productsData.map((product) => {
    const { _id, ownerId, ...rest } = product;
    return { ownerId: "66b5ccad2cf6ddb53d85e3a6", ...rest };
  });

  await Product.deleteMany({});
  await Product.insertMany(newMock);
} catch (err) {
  console.log("fail connect mongoose " + err.name);
  console.log(err);
}

await mongoose.disconnect();

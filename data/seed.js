import { DB_URL } from "../src/config.js";

import mongoose from "mongoose";
import { productsData_origin } from "./mock.js";
import {
  SampleData,
  Product,
  User,
  UserFavorites,
  ProductFavorites,
} from "./Product.js";

try {
  await mongoose.connect(`${DB_URL}`);
  console.log("success connect mongoose");

  await SampleData.deleteMany({});
  await SampleData.insertMany(productsData_origin);
} catch (err) {
  console.log("fail connect mongoose " + err.name);
  console.log(err);
}

await mongoose.disconnect();

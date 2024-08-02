import { DB_URL } from "../src/config.js";

import mongoose from "mongoose";
import { productsData_origin } from "./mock.js";
import {
  SampleDate,
  Product,
  User,
  UserFavorites,
  ProductFavorites,
} from "./Product.js";

try {
  await mongoose.connect(`${DB_URL}`);
  console.log("success connect mongoose");

  await SampleDate.deleteMany({});
  await SampleDate.insertMany(productsData_origin);
} catch (err) {
  console.log("fail connect mongoose " + err.name);
  console.log(err);
}

await mongoose.disconnect();

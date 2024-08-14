import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Product from "../models/product.js";
import data from "./mockData.js";
dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();

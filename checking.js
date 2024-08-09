import mongoose from "mongoose";
import Product from "./model/productAPI.js";

async function checkSeeding() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to database");

    const products = await Product.find();
    console.log("Products:", products);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkSeeding();

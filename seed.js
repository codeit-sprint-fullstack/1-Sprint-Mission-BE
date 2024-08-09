import mongoose from "mongoose";
import Product from "./model/productAPI.js";
import { DATABASE_URL } from "./env.js";

const seedProducts = [
  {
    name: "예시 1",
    description: "10자가 넘어가는 예시 1입니다.",
    price: 100,
    tags: ["tag1", "tag2"],
  },
  {
    name: "예시 2",
    description: "10자가 넘어가는 예시 2입니다.",
    price: 200,
    tags: ["tag3", "tag4"],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    await Product.deleteMany({});
    console.log("Cleared existing data");

    await Product.insertMany(seedProducts);
    console.log("Data seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error);
    mongoose.connection.close();
  }
};

// 실행
seedDatabase();

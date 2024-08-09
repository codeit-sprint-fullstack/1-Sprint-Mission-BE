import mongoose from "mongoose";
import Product from "./model/product.js"; // Product 모델 가져오기
import { DATABASE_URL } from "./env.js"; // 환경변수 가져오기

const seedProducts = [
  {
    name: "상품1",
    description: "10자가 넘어가는 설명문입니다",
    price: 1000,
    tags: ["태그1", "태그2"],
  },
  {
    name: "상품2",
    description: "10자가 넘어가는 설명문입니다",
    price: 2000,
    tags: ["태그3", "태그4"],
  },
  // 추가 데이터
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to DB");

    await Product.deleteMany({}); // 기존 데이터를 삭제
    console.log("Existing data cleared");

    await Product.insertMany(seedProducts); // 새로운 데이터 삽입
    console.log("Data seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

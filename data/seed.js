import dotenv from "dotenv";
import mongoose from "mongoose";
import { Data } from "./mock.js";
import Product from "../models/Product.js";

dotenv.config(); // .env 파일에서 환경 변수를 로드

const DATABASE_URL = process.env.DATABASE_URL;

async function seedDatabase() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    return;
  }

  try {
    await mongoose.connect(DATABASE_URL);

    // 기존 데이터 삭제
    await Product.deleteMany({});

    // Mock 데이터 삽입
    await Product.insertMany(Data.list);

    console.log("시딩 작업 성공");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // 데이터베이스 연결 종료
    await mongoose.connection.close();
  }
}

seedDatabase();

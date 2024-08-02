import dotenv from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "production";
const envFilePath = path.resolve(`./.env.${NODE_ENV}`).trim();

dotenv.config({ path: envFilePath });

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DB_URL: ${process.env.DB_URL}`);
console.log(`PORT: ${process.env.PORT}`);

export const config = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,
};

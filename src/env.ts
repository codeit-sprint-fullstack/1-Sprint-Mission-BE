import dotenv from "dotenv";
import path from "path";

const NODE_ENV: string = process.env.NODE_ENV || "production";
const envFilePath: string = path.resolve(`./.env.${NODE_ENV}`).trim();

dotenv.config({ path: envFilePath });

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`PORT: ${process.env.PORT}`);

export const config: {
  DATABASE_URL: string;
  PORT: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ARGON2_SECRET_KEY: string;
  ARGON2_SALT: number;
  GOOGLE_CLOUD_BUCKET_NAME: string;
  GOOGLE_APPLICATION_CREDENTIALS: string;
} = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  ARGON2_SECRET_KEY: process.env.ARGON2_SECRET_KEY as string,
  ARGON2_SALT: Number(process.env.ARGON2_SALT) || 16,
  GOOGLE_CLOUD_BUCKET_NAME: process.env.GOOGLE_CLOUD_BUCKET_NAME as string,
  GOOGLE_APPLICATION_CREDENTIALS: process.env
    .GOOGLE_APPLICATION_CREDENTIALS as string,
};

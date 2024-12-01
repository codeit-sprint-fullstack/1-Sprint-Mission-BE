import dotenv from "dotenv";
import path from "path";

const NODE_ENV: string = process.env.NODE_ENV || "production";
const envFilePath: string = path.resolve(`./.env.${NODE_ENV}`).trim();
// dotenv.config({ debug: true });
dotenv.config({ path: envFilePath });

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(process.cwd());
console.log(`envFilePath :${envFilePath}`);

export const config: {
  DATABASE_URL: string;
  PORT: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ARGON2_SECRET_KEY: string;
  ARGON2_SALT: number;
  GOOGLE_CLOUD_BUCKET_NAME: string;
  GOOGLE_APPLICATION_CREDENTIALS: string;
  AWS_S3_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  APP_DOMAIN: string;
  AWS_S3_BUCKET_NAME: string;
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
  AWS_S3_REGION: process.env.AWS_S3_REGION as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  APP_DOMAIN: process.env.APP_DOMAIN as string,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string,
};

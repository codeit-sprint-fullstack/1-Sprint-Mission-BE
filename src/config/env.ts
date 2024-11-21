import * as dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

export const port = process.env.PORT;
export const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
export const AWS_S3_REGION = process.env.AWS_S3_REGION || "";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

import dotenv from "dotenv";
dotenv.config();

//.env 파일의 환경변수값을 가져와 전역변수로 사용

export const POSTGRES_DATABASE_URL = process.env.POSTGRES_DATABASE_URL;
export const PORT = process.env.PORT;
export const PUBLIC_IMAGES_URL = process.env.PUBLIC_IMAGES_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

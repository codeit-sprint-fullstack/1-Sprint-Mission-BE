import dotenv from "dotenv";
dotenv.config();

//.env 파일의 환경변수값을 가져와 전역변수로 사용

export const POSTGRES_DATABASE_URL = process.env.POSTGRES_DATABASE_URL;
export const PORT = process.env.PORT;
export const PUBLIC_IMAGES_URL = process.env.PUBLIC_IMAGES_URL;

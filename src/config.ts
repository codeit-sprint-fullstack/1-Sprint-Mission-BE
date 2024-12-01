import { config } from "./env";

export const DATABASE_URL: string = config.DATABASE_URL;
export const PORT: string = config.PORT;
export const ACCESS_TOKEN_SECRET: string = config.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET: string = config.REFRESH_TOKEN_SECRET;
export const ARGON2_SECRET_KEY: string = config.ARGON2_SECRET_KEY;
export const ARGON2_SALT: number = config.ARGON2_SALT;
export const GOOGLE_CLOUD_BUCKET_NAME: string = config.GOOGLE_CLOUD_BUCKET_NAME;
export const GOOGLE_APPLICATION_CREDENTIALS: string =
  config.GOOGLE_APPLICATION_CREDENTIALS;
export const AWS_S3_REGION: string = config.AWS_S3_REGION;
export const AWS_ACCESS_KEY_ID: string = config.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY: string = config.AWS_SECRET_ACCESS_KEY;
export const APP_DOMAIN: string = config.APP_DOMAIN;
export const AWS_S3_BUCKET_NAME: string = config.AWS_S3_BUCKET_NAME;

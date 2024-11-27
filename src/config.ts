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

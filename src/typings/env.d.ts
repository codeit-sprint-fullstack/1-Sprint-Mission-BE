declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    POSTGRES_DATABASE_URL: string;
    PUBLIC_IMAGES_URL: string;
    PORT: string;
  }
}

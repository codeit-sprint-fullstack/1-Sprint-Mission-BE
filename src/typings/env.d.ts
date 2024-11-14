//node 전체에서 환경변수 타입을 정의 한다
declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    POSTGRES_DATABASE_URL: string;
    PUBLIC_IMAGES_URL: string;
    PORT: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_REGION: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
  }
}

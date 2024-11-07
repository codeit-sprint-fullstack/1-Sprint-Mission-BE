declare namespace Express {
  interface Request {
    auth?: {
      userId: string;
      iat: number;
      exp: number;
    };
    files?: Express.Multer.File[];
  }
}

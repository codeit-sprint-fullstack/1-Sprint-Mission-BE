import env from "../env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.baseUrl,
    },
  },
});

export default prisma;

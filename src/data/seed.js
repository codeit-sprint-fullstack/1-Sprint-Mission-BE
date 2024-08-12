import * as dotenv from "dotenv";
import { articles, comments } from "./mockData.js";
import { PrismaClient } from "@prisma/client/extension";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany({});
  await prisma.comment.deleteMany({});

  await prisma.article.createMany({
    data: articles,
  });
  await prisma.comment.createMany({
    data: comments,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

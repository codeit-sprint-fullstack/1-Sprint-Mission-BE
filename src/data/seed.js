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
  for (let data of comments) {
    await prisma.comment.create({
      data: data,
    });
  }
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

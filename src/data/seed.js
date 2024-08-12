import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany({});
  await prisma.comment.deleteMany({});

  const article1 = await prisma.article.create({
    data: {
      title: "First Article Title",
      content: "First Article Content",
    },
  });
  const article2 = await prisma.article.create({
    data: {
      title: "Second Article Title",
      content: "Second Article Content",
    },
  });
  const article3 = await prisma.article.create({
    data: {
      title: "Third Article Title",
      content: "Third Article Content",
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content: "First article Comment1",
        category: "BOARD",
        articleId: article1.id,
      },
      {
        content: "First article Comment2",
        category: "BOARD",
        articleId: article1.id,
      },
      {
        content: "Second article Comment",
        category: "MARKET",
        articleId: article2.id,
      },
      {
        content: "Third article Comment",
        category: "MARKET",
        articleId: article3.id,
      },
    ],
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

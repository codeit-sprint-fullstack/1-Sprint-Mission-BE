import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.article.deleteMany();
  await prisma.articleComment.deleteMany();

  // Create articles
  const article1 = await prisma.article.create({
    data: {
      name: "1번",
      title: "article1",
      content: "content1",
    },
  });
  const article2 = await prisma.article.create({
    data: {
      name: "2번",
      title: "article2",
      content: "content2",
    },
  });
  const article3 = await prisma.article.create({
    data: {
      name: "3번",
      title: "article3",
      content: "content3",
    },
  });
  const article4 = await prisma.article.create({
    data: {
      name: "4번",
      title: "article4",
      content: "content4",
    },
  });
  const article5 = await prisma.article.create({
    data: {
      name: "5번",
      title: "article5",
      content: "content5",
    },
  });
  const article6 = await prisma.article.create({
    data: {
      name: "6번",
      title: "article6",
      content: "content6",
    },
  });
  const article7 = await prisma.article.create({
    data: {
      name: "7번",
      title: "article7",
      content: "content7",
    },
  });
  const article8 = await prisma.article.create({
    data: {
      name: "8번",
      title: "article8",
      content: "content8",
    },
  });
  const article9 = await prisma.article.create({
    data: {
      name: "9번",
      title: "article9",
      content: "content9",
    },
  });
  const article10 = await prisma.article.create({
    data: {
      name: "10번",
      title: "article10",
      content: "content10",
    },
  });

  // Create article comments
  await prisma.articleComment.create({
    data: {
      name: "1번",
      content: "comment1",
      articleId: article1.id,
    },
  });

  await prisma.articleComment.create({
    data: {
      name: "1-2번",
      content: "comment2",
      articleId: article1.id,
    },
  });
  await prisma.articleComment.create({
    data: {
      name: "3번",
      content: "comment3",
      articleId: article2.id,
    },
  });
  await prisma.articleComment.create({
    data: {
      name: "3번",
      content: "comment4",
      articleId: article3.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

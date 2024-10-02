import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.article.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productComment.deleteMany();

  // Create articles
  const article1 = await prisma.article.create({
    data: {
      title: "article1",
      content: "content1",
    },
  });
  const article2 = await prisma.article.create({
    data: {
      title: "article2",
      content: "content2",
    },
  });
  const article3 = await prisma.article.create({
    data: {
      title: "article3",
      content: "content3",
    },
  });

  // Create article comments
  await prisma.articleComment.create({
    data: {
      content: "comment1",
      articleId: article1.id,
    },
  });

  await prisma.articleComment.create({
    data: {
      content: "comment2",
      articleId: article1.id,
    },
  });
  await prisma.articleComment.create({
    data: {
      content: "comment3",
      articleId: article2.id,
    },
  });
  await prisma.articleComment.create({
    data: {
      content: "comment4",
      articleId: article3.id,
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "product1",
      description: "description1",
      price: 100,
      tag: ["tag1", "tag2"],
    },
  });
  const product2 = await prisma.product.create({
    data: {
      name: "product2",
      description: "description2",
      price: 200,
      tag: ["tag1", "tag2"],
    },
  });
  const product3 = await prisma.product.create({
    data: {
      name: "product3",
      description: "description3",
      price: 300,
      tag: ["tag1", "tag2"],
    },
  });

  // Create product comments
  await prisma.productComment.create({
    data: {
      content: "comment1",
      productId: product1.id,
    },
  });
  await prisma.productComment.create({
    data: {
      content: "comment2",
      productId: product2.id,
    },
  });

  await prisma.productComment.create({
    data: {
      content: "comment3",
      productId: product3.id,
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

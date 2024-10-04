import { PrismaClient } from "@prisma/client";

import { PRODUCTS, ARTICLES } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();

  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  await Promise.all(
    PRODUCTS.map((product) => {
      const { comments, ...productData } = product;

      return prisma.product.create({
        data: {
          ...productData,
          comments: {
            create: comments.map((comment) => ({
              ...comment,
            })),
          },
        },
      });
    })
  );

  await Promise.all(
    ARTICLES.map((article) => {
      const { comments, ...articleData } = article;

      return prisma.article.create({
        data: {
          ...articleData,
          comments: {
            create: comments.map((comment) => ({
              ...comment,
            })),
          },
        },
      });
    })
  );
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

import { PrismaClient } from "@prisma/client";
import {
  Users,
  Products,
  Articles,
  ArticleComments,
  ProductComments,
} from "./mockPostgreSQL.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: Users,
  });
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: Products,
  });
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: Articles,
  });
  await prisma.articleComment.deleteMany();
  await prisma.articleComment.createMany({
    data: ArticleComments,
  });
  await prisma.productComment.deleteMany();
  await prisma.productComment.createMany({
    data: ProductComments,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err.name);
    await prisma.$disconnect();
    process.exit(1);
  });

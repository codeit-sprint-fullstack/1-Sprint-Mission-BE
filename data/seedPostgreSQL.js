import { PrismaClient } from "@prisma/client";
import {
  User,
  Product,
  Article,
  ArticleFavoriteUser,
  ArticleComment,
  ProductComment,
} from "./mockPostgreSQL.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: User,
  });
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: Product,
  });
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: Article,
  });
  await prisma.articleFavoriteUser.deleteMany();
  await prisma.articleFavoriteUser.createMany({
    data: ArticleFavoriteUser,
  });
  await prisma.articleComment.deleteMany();
  await prisma.articleComment.createMany({
    data: ArticleComment,
  });
  await prisma.productComment.deleteMany();
  await prisma.productComment.createMany({
    data: ProductComment,
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

import { PrismaClient } from "@prisma/client";
import {
  User,
  Product,
  Post,
  FavoritePost,
  PostComment,
  ProductComment,
} from "./mock.js";

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
  await prisma.post.deleteMany();
  await prisma.post.createMany({
    data: Post,
  });
  await prisma.postfavoritepost.deleteMany();
  await prisma.postfavoritepost.createMany({
    data: FavoritePost,
  });
  await prisma.postComment.deleteMany();
  await prisma.postComment.createMany({
    data: PostComment,
  });
  await prisma.productComment.deleteMany();
  await prisma.productComment.createMany({
    data: ProductComment,
  });
  // await prisma.user.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.article.deleteMany();
  // await prisma.articleFavoriteUser.deleteMany();
  // await prisma.articleComment.deleteMany();
  // await prisma.productComment.deleteMany();
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

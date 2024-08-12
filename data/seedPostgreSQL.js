import { PrismaClient } from "@prisma/client";
import { Users, Articles, Comments } from "./mockPostgreSQL.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: Users,
  });
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: Articles,
  });
  await prisma.comment.deleteMany();
  await prisma.comment.createMany({
    data: Comments,
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

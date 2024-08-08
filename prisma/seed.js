import { PrismaClient } from "@prisma/client";
import { USER, ARTICLE } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: USER,
    // skipDuplicates: true,
  });
  // prisma.article.deleteMany();
  // prisma.article.createMany({
  //   data: ARTICLE,
  //   skipDuplicates: true,
  // });
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

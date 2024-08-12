import { PrismaClient } from "@prisma/client";
import { USER, COMMENT } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  // await prisma.user.deleteMany();
  // await prisma.user.createMany({
  //   data: USER,
  //   // skipDuplicates: true,
  // });
  // prisma.article.deleteMany();
  // prisma.article.createMany({
  //   data: ARTICLE,
  //   skipDuplicates: true,
  // });
  await prisma.comment.deleteMany();
  await prisma.comment.createMany({
    data: COMMENT,
    // skipDuplicates: true,
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

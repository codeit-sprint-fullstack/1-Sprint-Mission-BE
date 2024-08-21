import { PrismaClient } from "@prisma/client";
import { articleData } from "./Articles.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();

  // 게시글 초기 데이터 삽입
  await prisma.article.createMany({
    data: articleData,
    skipDuplicates: true,
  });

  console.log("게시글 데이터 시딩 작업 완료되었습니다.");
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

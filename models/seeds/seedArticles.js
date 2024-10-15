import { PrismaClient } from "@prisma/client";
import { articleData } from "./Articles.js";
import { marketPost } from "./MarketPost.js"; // 중고마켓 데이터 파일 추가

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.marketPost.deleteMany(); // 중고마켓 데이터 삭제 추가

  // 게시글 초기 데이터 삽입
  await prisma.article.createMany({
    data: articleData,
    skipDuplicates: true,
  });

  // 중고마켓 시드 데이터 삽입
  await prisma.marketPost.createMany({
    data: marketPost, // 중고마켓 데이터 삽입
    skipDuplicates: true,
  });

  console.log("자유게시판 및 중고마켓 게시글 데이터 시딩 작업 완료되었습니다.");
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

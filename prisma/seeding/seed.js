import { PrismaClient } from '@prisma/client';
import { ARTICLES, COMMENTS } from './mock.js';
const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany();

  // 목 데이터 삽입
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
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

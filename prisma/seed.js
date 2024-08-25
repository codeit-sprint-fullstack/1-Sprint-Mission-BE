import { PrismaClient } from '@prisma/client';
import ARTICLES from './mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: ARTICLES,
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

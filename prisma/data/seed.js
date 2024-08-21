import { PrismaClient } from '@prisma/client';
import { USERS, ARTICLES, COMMENTS } from './mock.js';

const prisma = new PrismaClient();



async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  }),
    await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  }),
    await prisma.comment.deleteMany();
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

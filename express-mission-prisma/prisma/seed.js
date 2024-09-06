import { PrismaClient } from "@prisma/client";
import * as seed from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.noticeBoard.deleteMany();
  await prisma.freeCommend.deleteMany();
  await prisma.usedCommend.deleteMany();
  await prisma.usedMarket.deleteMany();

  await prisma.user.createMany({
    data: seed.USERS,
    skipDuplicates: true,
  });
  await prisma.noticeBoard.createMany({
    data: seed.NOTICEBOARDS,
    skipDuplicates: true,
  });
  await prisma.freeCommend.createMany({
    data: seed.FREECOMMENDS,
    skipDuplicates: true,
  });
  await prisma.usedMarket.createMany({
    data: seed.USEDMARKETS,
    skipDuplicates: true,
  });
  await prisma.usedCommend.createMany({
    data: seed.USEDCOMMENDS,
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

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const prisma = new PrismaClient();

const data = [
  {
    id: uuidv4(),
    title: "맥북",
    content: "맥북 입니다",
  },
  {
    id: uuidv4(),
    title: "맥북2",
    content: "맥북2 입니다",
  },
  {
    id: uuidv4(),
    title: "맥북3",
    content: "맥북3 입니다",
  },
  {
    id: uuidv4(),
    title: "맥북4",
    content: "맥북4 입니다",
  },
];

async function main() {
  await prisma.article.deleteMany({});
  await prisma.articleComment.deleteMany({});
  await prisma.article.createMany({ data, skipDuplicates: true });
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

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // data 초기화
  await prisma.articleComment.deleteMany({});
  await prisma.article.deleteMany({});

  // 게시글 1
  const article1 = await prisma.article.create({
    data: {
      title: "첫 번째 게시글",
      content: "이것은 첫 번째 게시글의 내용입니다.",
      comments: {
        create: [],
      },
    },
  });

  // 게시글 2
  const article2 = await prisma.article.create({
    data: {
      title: "두 번째 게시글",
      content: "이것은 두 번째 게시글의 내용입니다.",
      comments: {
        create: [],
      },
    },
  });

  // 게시글 3
  const article3 = await prisma.article.create({
    data: {
      title: "세 번째 게시글",
      content: "이것은 세 번째 게시글의 내용입니다.",
      comments: {
        create: [],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

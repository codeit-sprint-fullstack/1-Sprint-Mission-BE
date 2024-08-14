// src/prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 예시 게시글
  const article1 = await prisma.article.create({
    data: {
      title: "첫 글이다",
      content: "와 대박 저 너무 기뻐요",
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "두번째 글입니다",
      content: "ㄲㅂ",
    },
  });

  // 예시 중고템
  const marketItem1 = await prisma.marketItem.create({
    data: {
      name: "RTX 3060",
      description: "RTX 3060 팝니다 담배안펴요, 개안키워요 네고 사절",
      price: 500000,
    },
  });

  const marketItem2 = await prisma.marketItem.create({
    data: {
      name: "GTX 1050",
      description: "산지 좀 됐는데, 이번에 넘어가려고 팔아봅니다",
      price: 70000,
    },
  });

  // 예시 댓글
  await prisma.comment.createMany({
    data: [
      {
        content: "ㅋㅋ 축하요",
        articleId: article1.id,
      },
      {
        content: "ㅋㅋ ㄲㅃㄲㅃ",
        articleId: article2.id,
      },
      {
        content: "3060을 50에 올리는건 그냥 안팔겠단거 아님?",
        marketItemId: marketItem1.id,
      },
      {
        content: "님 1050 그 정도 썼으면 팔게아니라 그냥 평생 같이 살아도 될듯",
        marketItemId: marketItem2.id,
      },
    ],
  });

  console.log("시딩 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

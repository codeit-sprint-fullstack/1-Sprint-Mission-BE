import { PrismaClient } from "@prisma/client";
import { MarketComments } from "./MarketComment.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.comment.deleteMany({
    where: {
      boardType: "market",
    },
  });

  // 댓글 초기 데이터 삽입
  await prisma.comment.createMany({
    data: MarketComments.map(({ id, ...rest }) => rest),
    skipDuplicates: true,
  });

  console.log("중고마켓 댓글 시딩 작업 완료되었습니다.");
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

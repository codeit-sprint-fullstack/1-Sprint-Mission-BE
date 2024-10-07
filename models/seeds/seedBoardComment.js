import { PrismaClient } from "@prisma/client";
import { BoardComments } from "./BoardComment.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.comment.deleteMany({
    where: {
      boardType: "board",
    },
  });

  // 댓글 초기 데이터 삽입
  await prisma.comment.createMany({
    data: BoardComments.map(({ id, ...rest }) => rest), // id를 뺀 나머지 데이터만 삽입
    skipDuplicates: true,
  });

  console.log("자유게시판 댓글 시딩 작업 완료되었습니다.");
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

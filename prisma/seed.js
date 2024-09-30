import { PrismaClient } from "@prisma/client";
// import { USER, COMMENT } from "./mock.js";
import { users, articles, comments } from "./mock_2.js"; // mook.js 파일에서 데이터 가져오기

const prisma = new PrismaClient();
// async function main() {
//   // 기존 데이터 삭제
//   // await prisma.user.deleteMany();
//   // await prisma.user.createMany({
//   //   data: USER,
//   //   // skipDuplicates: true,
//   // });
//   // prisma.article.deleteMany();
//   // prisma.article.createMany({
//   //   data: ARTICLE,
//   //   skipDuplicates: true,
//   // });
//   await prisma.comment.deleteMany();
//   await prisma.comment.createMany({
//     data: COMMENT,
//     // skipDuplicates: true,
//   });
// }

async function main() {
  // console.log("Seeding database...");

  // 사용자 데이터 시딩
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: users,
    // skipDuplicates: true,
  });

  // 글 데이터 시딩
  // await prisma.article.deleteMany();
  // await prisma.article.createMany({
  //   data: articles,
  //   skipDuplicates: true,
  // });

  // // 댓글 데이터 시딩
  // await prisma.comment.deleteMany();
  // await prisma.comment.createMany({
  // data: comments,
  // skipDuplicates: true,
  // });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

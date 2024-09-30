import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // bcrypt 가져오기

const prisma = new PrismaClient();

const users = [
  {
    email: "user1@example.com",
    nickname: "고객1",
    password: "password1", // 일반 비밀번호로 추가
  },
  {
    email: "user2@example.com",
    nickname: "고객2",
    password: "password2",
  },
  {
    email: "user3@example.com",
    nickname: "고객3",
    password: "password3",
  },
  {
    email: "user4@example.com",
    nickname: "고객4",
    password: "password4",
  },
  {
    email: "user5@example.com",
    nickname: "고객5",
    password: "password5",
  },
  {
    email: "user6@example.com",
    nickname: "고객6",
    password: "password6",
  },
  {
    email: "user7@example.com",
    nickname: "고객7",
    password: "password7",
  },
  {
    email: "user8@example.com",
    nickname: "고객8",
    password: "password8",
  },
  {
    email: "user9@example.com",
    nickname: "고객9",
    password: "password9",
  },
  {
    email: "user10@example.com",
    nickname: "고객10",
    password: "password10",
  },
];

async function main() {
  for (const user of users) {
    // 비밀번호 해시 처리
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10은 saltRounds

    // 사용자 생성
    await prisma.user.create({
      data: {
        email: user.email,
        nickname: user.nickname,
        encryptedPassword: hashedPassword, // 해시된 비밀번호 저장
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

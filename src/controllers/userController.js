import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client"; // Prisma ORM 사용 예시 (필요시 다른 ORM 또는 DB 라이브러리 사용 가능)

const prisma = new PrismaClient();

export async function getUser(req, res, next) {
  try {
    // `authenticateUser` 미들웨어를 통과한 후, `req.user`에 사용자 정보가 저장되어 있습니다.
    const { userId } = req.user;

    // 데이터베이스에서 사용자 정보를 조회합니다.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 사용자 정보를 클라이언트에 반환
    return res.status(200).json({
      message: "사용자 정보 조회 성공",
      user,
    });
  } catch (error) {
    console.error("사용자 정보 조회 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "사용자 정보를 조회할 수 없습니다." });
  }
}

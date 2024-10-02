import prisma from "../models/index.js";

// 특정 ID로 유저 조회 (서비스 계층 함수)
export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

import { prisma } from "../utils/prisma.js";

const userModel = {
  findById: async (id) => {
    return prisma.user.findUnique({ where: { id } });
  },
  updateUser: async (id, data) => {
    return prisma.user.update({ where: { id }, data });
  },
  // 다른 필요한 메서드들 추가
};

export default userModel;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const postRepository = {
  getById: async (id) => {
    return await prisma.fleaMarket.findUnique({
      where: {
        id: Number(id), // ID를 숫자로 변환하여 조회
      },
    });
  },
};

export default postRepository;

// imageService.js

import { prisma } from '../utils/prisma.js';

export const uploadImage = async (imageData) => {
  return { url: `https://example.com/images/${Date.now()}.jpg` };
};

export const getImage = async (imageId) => {
  // 이미지 조회 로직 구현
  return prisma.image.findUnique({
    where: { id: imageId },
  });
};

export const deleteImage = async (imageId) => {
  // 이미지 삭제 로직 구현
  return prisma.image.delete({
    where: { id: imageId },
  });
};

import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.comment.create({
    data: createData,
  });
}

async function getAllByFilter(fillter) {
  const { orderBy, take, where, cursor = "" } = fillter;
  if (cursor === "") {
    return await prisma.comment.findMany({
      orderBy,
      take,
      where,
    });
  } else if (cursor !== "") {
    return await prisma.comment.findMany({
      orderBy,
      take,
      where,
      cursor,
    });
  }
}

async function countByFilter(fillter) {
  return await prisma.comment.count({
    where: fillter,
  });
}

async function update(updateData) {
  const { where, data } = updateData;
  return await prisma.comment.update({
    where,
    data,
  });
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  update,
};

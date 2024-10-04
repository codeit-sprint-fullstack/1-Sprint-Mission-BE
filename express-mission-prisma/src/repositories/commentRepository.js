import { assert } from "superstruct";
import prisma from "../config/prisma.js";
import { updateComment } from "../structs/commentStruct.js";

async function create(createData, struct) {
  assert(createData, struct);
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

export default {
  create,
  getAllByFilter,
  countByFilter,
};

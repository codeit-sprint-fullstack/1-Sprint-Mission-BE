import { assert } from "superstruct";
import prisma from "../../config/prisma.js";
import {
  createProductCommend,
  updateCommend,
} from "../../structs/commentStruct.js";

async function create(createData) {
  assert(createData, createProductCommend);
  return await prisma.comment.create({
    data: createData,
  });
}

async function getAllByFilter(fillter) {
  const { orderBy, skip, take, where, cursor = "" } = fillter;
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

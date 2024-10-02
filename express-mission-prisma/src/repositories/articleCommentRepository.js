import { assert } from "superstruct";
import prisma from "../config/prisma.js";
import {
  createArticleCommend,
  updateCommend,
} from "../structs/commentStruct.js";

async function create(createData) {
  assert(createData, createArticleCommend);
  return await prisma.comment.create({
    data: createData,
  });
}

export default {
  create,
};

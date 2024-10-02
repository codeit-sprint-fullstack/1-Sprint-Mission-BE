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

export default {
  create,
};

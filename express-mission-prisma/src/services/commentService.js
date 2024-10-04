import commentRepository from "../repositories/commentRepository.js";
import { assert } from "superstruct";
import {
  createArticleComment,
  createProductComment,
  updateComment,
} from "../structs/commentStruct.js";

async function create(createData) {
  return await commentRepository.create(createData);
}

async function getAllByFilter(id, query, type) {
  const { cursor = "", pageSize, orderBy } = query;
  const order = orderBy || "recent";
  let findValueDefault;

  if (type === "article") {
    let pageSizeNum = parseInt(pageSize) || 5;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { articleId: id },
    };
  } else if (type === "product") {
    let pageSizeNum = parseInt(pageSize) || 2;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { productId: id },
    };
  }

  const findValue =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return await commentRepository.getAllByFilter(findValue);
}

async function countByFilter(id, type) {
  let fillter;

  if (type === "article") {
    fillter = { articleId: id };
  } else if (type === "product") {
    fillter = { productId: id };
  }

  return await commentRepository.countByFilter(fillter);
}

async function update(id, updateData) {
  const updateDataWithId = { where: { id }, data: updateData };
  return await commentRepository.update(updateDataWithId);
}

async function deleteById(id) {
  return await commentRepository.deleteById(id);
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  update,
  deleteById,
};

import commentRepository from "../repositories/commentRepository.js";
import { assert } from "superstruct";
import {
  createArticleComment,
  createProductComment,
  updateComment,
} from "../structs/commentStruct.js";

async function create(id, createData, type) {
  if (type === "article") {
    const createDataWithId = { ...createData, articleId: id };
    assert(createDataWithId, createArticleComment);
    return await commentRepository.create(createDataWithId);
  } else if (type === "product") {
    const createDataWithId = { ...createData, productId: id };
    assert(createDataWithId, createProductComment);
    return await commentRepository.create(createDataWithId);
  }
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

export default {
  create,
  getAllByFilter,
  countByFilter,
};

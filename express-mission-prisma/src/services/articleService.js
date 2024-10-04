import articleRepository from "../repositories/articleRepository.js";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";

async function create(createData) {
  return await articleRepository.create(createData);
}

async function getAllByFilter(query) {
  const { page, pageSize, orderBy, keyWord = "" } = query;

  const pageNum = page || 1;
  const pageSizeNum = pageSize || 10;
  const order = orderBy || "recent";
  const offset = (pageNum - 1) * pageSizeNum;
  const whereOrBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const whereOr = {
    OR: [
      {
        title: whereOrBody,
      },
      {
        content: whereOrBody,
      },
    ],
  };

  const fillter = {
    orderBy: { createdAt: "desc" },
    skip: parseInt(offset),
    take: parseInt(pageSizeNum),
    where: whereOr,
  };

  return await articleRepository.getAllByFilter(fillter);
}

async function countByFilter(query) {
  const { keyWord = "" } = query;

  const fillterBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const fillter = {
    OR: [
      {
        title: fillterBody,
      },
      {
        content: fillterBody,
      },
    ],
  };

  return await articleRepository.countByFilter(fillter);
}

async function getById(id) {
  return await articleRepository.getById(id);
}

async function update(id, updateData) {
  const updateDataWithId = { where: { id }, data: updateData };

  return await articleRepository.update(updateDataWithId);
}

async function deleteById(id) {
  return await articleRepository.deleteById(id);
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  getById,
  update,
  deleteById,
};

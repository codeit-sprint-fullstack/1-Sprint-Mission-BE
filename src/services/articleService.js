import { assert } from "superstruct";
import { CreateArticle, PatchArticle, Uuid } from "../validation/structs.js";
import articleRepository from "../repositories/articleRepository.js";

async function getArticles({ orderBy, page, pageSize, keyword }) {
  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case "like":
      sortOption = { likeCount: "desc" };
      break;
    case "recent":
    default:
      sortOption = { createdAt: "desc" };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== "")
    searchQuery = {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    };

  const [totalCount, list] = await Promise.all([
    articleRepository.getTotalCount(searchQuery),
    articleRepository.getAll({ searchQuery, sortOption, offset, pageSize }),
  ]);

  return { totalCount, list };
}

async function getArticle(id) {
  assert(id, Uuid);
  return await articleRepository.getById(id);
}

async function createArticle(data) {
  assert(data, CreateArticle);
  return await articleRepository.create(data);
}

async function updateArticle(id, data) {
  assert(id, Uuid);
  assert(data, PatchArticle);

  return await articleRepository.updateById(id, data);
}

async function deleteArticle(id) {
  assert(id, Uuid);
  return await articleRepository.deleteById(id);
}

export default {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};

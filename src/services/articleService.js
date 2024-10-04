import { assert } from "superstruct";
import { CreateArticle, PatchArticle } from "../validations/structs.js";
import articleRepository from "../repositories/articleRepository.js";

export async function getArticles({ orderBy, page, pageSize, keyword }) {
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

export async function getArticle(id) {
  return await articleRepository.getById(id);
}

export async function createArticle(data) {
  assert(data, CreateArticle);
  return await articleRepository.create(data);
}

export async function updateArticle(id, data) {
  assert(data, PatchArticle);
  return await articleRepository.updateById(id, data);
}

export async function deleteArticle(id) {
  return await articleRepository.deleteById(id);
}

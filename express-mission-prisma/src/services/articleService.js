import articleRepository from "../repositories/articleRepository.js";

async function create(article) {
  return await articleRepository.create(article);
}

async function getAllByFilter(fillter) {
  return await articleRepository.getAllByFilter(fillter);
}

async function countByFilter(fillter) {
  return await articleRepository.countByFilter(fillter);
}

export default {
  create,
  getAllByFilter,
  countByFilter,
};

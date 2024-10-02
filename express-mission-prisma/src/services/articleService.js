import articleRepository from "../repositories/articleRepository.js";

async function getAllByFilter(fillter) {
  return await articleRepository.getAllByFilter(fillter);
}

async function countByFilter(fillter) {
  return await articleRepository.countByFilter(fillter);
}

export default {
  getAllByFilter,
  countByFilter,
};

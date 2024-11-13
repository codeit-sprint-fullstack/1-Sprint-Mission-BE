import articleRepository from "../repositories/articleRepository.js";
import {
  createKeywordfilterOtions,
  createPageSizefilterOptions,
} from "../utils/article/articleFilterOptions.js";

async function create(createData) {
  return await articleRepository.create(createData);
}

async function getAllByfilter(query) {
  const filterByPageSize = createPageSizefilterOptions(query);
  return await articleRepository.getAllByfilter(filterByPageSize);
}

async function countByfilter(query) {
  const filterByKeword = createKeywordfilterOtions(query);
  return await articleRepository.countByfilter(filterByKeword);
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
  getAllByfilter,
  countByfilter,
  getById,
  update,
  deleteById,
};

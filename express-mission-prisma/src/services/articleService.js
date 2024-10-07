import articleRepository from "../repositories/articleRepository.js";
import {
  createFillterOtionsByKeyword,
  createPageSizeFilterOptions,
} from "../utils/filterOptions.js";

async function create(createData) {
  return await articleRepository.create(createData);
}

async function getAllByFilter(query) {
  const filterByPageSize = createPageSizeFilterOptions(query);
  return await articleRepository.getAllByFilter(filterByPageSize);
}

async function countByFilter(query) {
  const fillterByKeword = createFillterOtionsByKeyword(query);
  return await articleRepository.countByFilter(fillterByKeword);
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

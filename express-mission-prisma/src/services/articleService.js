import articleRepository from "../repositories/articleRepository.js";
import {
  createKeywordFillterOtions,
  createPageSizeFillterOptions,
} from "../utils/article/articleFillterOptions.js";

async function create(createData) {
  return await articleRepository.create(createData);
}

async function getAllByFillter(query) {
  const filterByPageSize = createPageSizeFillterOptions(query);
  return await articleRepository.getAllByFillter(filterByPageSize);
}

async function countByFillter(query) {
  const fillterByKeword = createKeywordFillterOtions(query);
  return await articleRepository.countByFillter(fillterByKeword);
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
  getAllByFillter,
  countByFillter,
  getById,
  update,
  deleteById,
};

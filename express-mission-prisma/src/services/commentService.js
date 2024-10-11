import commentRepository from "../repositories/commentRepository.js";
import {
  createCursorFilterOptions,
  createTypefilterOptions,
} from "../utils/filterOptions/commentFilterOptions.js";

async function create(createData) {
  return await commentRepository.create(createData);
}

async function getAllByFilter(id, query, type) {
  const filterByCursor = createCursorFilterOptions(id, query, type);
  return await commentRepository.getAllByFilter(filterByCursor);
}

async function countByFilter(id, type) {
  const filterByType = createTypefilterOptions(id, type);
  return await commentRepository.countByFilter(filterByType);
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

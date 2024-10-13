import productRepositpry from "../repositories/productRepositpry.js";
import {
  createKeywordfilterOtions,
  createPageSizefilterOptions,
} from "../utils/product/productFilterOptions.js";

async function create(createData) {
  return await productRepositpry.create(createData);
}

async function getById(id) {
  return await productRepositpry.getById(id);
}

async function getAllByfilter(query) {
  const filterByPageSize = createPageSizefilterOptions(query);
  return await productRepositpry.getAllByfilter(filterByPageSize);
}

async function countByfilter(query) {
  const filterByKeword = createKeywordfilterOtions(query);
  return await productRepositpry.countByfilter(filterByKeword);
}

async function update(id, updateData) {
  const updateDataWithId = { where: { id }, data: updateData };
  return await productRepositpry.update(updateDataWithId);
}

async function deleteById(id) {
  return await productRepositpry.deleteById(id);
}

export default {
  create,
  getById,
  getAllByfilter,
  countByfilter,
  update,
  deleteById,
};

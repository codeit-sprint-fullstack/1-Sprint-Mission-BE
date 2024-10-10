import productRepositpry from "../repositories/productRepositpry.js";

async function create(createData) {
  return await productRepositpry.create(createData);
}

async function getById(id) {
  return await productRepositpry.getById(id);
}

export default {
  create,
  getById,
};

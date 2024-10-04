import productRepositpry from "../repositories/productRepositpry.js";

async function create(createData) {
  return await productRepositpry.create(createData);
}

export default {
  create,
};

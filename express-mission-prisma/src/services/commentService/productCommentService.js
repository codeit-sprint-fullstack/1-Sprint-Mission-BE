import productCommentRepository from "../../repositories/commentRepository/productCommentRepository.js";

async function create(id, createData) {
  const createDataWithId = { ...createData, productId: id };
  return await productCommentRepository.create(createDataWithId);
}

export default {
  create,
};

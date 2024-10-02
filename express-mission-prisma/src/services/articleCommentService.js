import articleCommentRepository from "../repositories/articleCommentRepository.js";

async function create(id, createData) {
  const createDataWithId = { ...createData, articleId: id };
  return await articleCommentRepository.create(createDataWithId);
}

export default {
  create,
};

import likeRepository from "../repositories/likeRepository.js";

async function create(createData) {
  return await likeRepository.create(createData);
}

export default {
  create,
};

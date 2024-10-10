import userRepository from "../repositories/userRepository.js";

async function getbyId(id) {
  return await userRepository.getById(id);
}

export default {
  getbyId,
};

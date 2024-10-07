import { PatchUser, assert, Uuid } from "../validations/structs.js";
import * as userRepository from "../repositories/userRepository.js";

export async function getUserById(id) {
  assert(id, Uuid);
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("존재하지 않는 유저 입니다.");
    error.code = 404;
    throw error;
  }
  return user;
}

import { PatchUser, assert } from "../validations/structs";
import * as userRepository from "../repositories/userRepository";

export async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }
  return filteredSensitiveUserData(user);
}

export async function updateUser(id, data) {
  assert(PatchUser, data);
  return await userRepository.update(id, data);
}

import { PatchUser, assert } from "../validations/structs.js";
import * as userRepository from "../repositories/userRepository.js";

export async function getById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }
  return filteredSensitiveUserData(user);
}

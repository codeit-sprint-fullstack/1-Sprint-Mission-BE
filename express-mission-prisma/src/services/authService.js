import authRepository from "../repositories/authRepository.js";
import { filterSensitiveUserData, hashPassword } from "../utils/authHandler.js";

async function singUp(singUpData) {
  const { email, nickname, password } = singUpData;
  const existedUser = await authRepository.findByEmail(email);

  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 422;
    error.data = { email };
    throw error;
  }

  const encryptedPassword = await hashPassword(password);

  const userPayload = {
    email,
    nickname,
    encryptedPassword,
  };

  const singUpUser = await authRepository.singUp(userPayload);
  return filterSensitiveUserData(singUpUser);
}

export default {
  singUp,
};

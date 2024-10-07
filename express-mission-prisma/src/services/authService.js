import authRepository from "../repositories/authRepository.js";
import authHandler from "../utils/authHandler.js";

async function singUp(singUpData) {
  const { email } = singUpData;
  const existedUser = await authRepository.findByEmail(email);

  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 422;
    error.data = { email };
    throw error;
  }

  const singUpUser = await authRepository.singUp(singUpData);
  return authHandler.filterSensitiveUserData(singUpUser);
}

export default {
  singUp,
};

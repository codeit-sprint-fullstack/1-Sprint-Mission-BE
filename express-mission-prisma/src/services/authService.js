import authRepository from "../repositories/authRepository.js";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "../utils/authHandler.js";
import jwt from "jsonwebtoken";

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

async function singIn(singInData) {
  const { email, password } = singInData;
  const user = await authRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  await verifyPassword(password, user.encryptedPassword);
  return filterSensitiveUserData(user);
}

async function createToken(user, type) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export default {
  singUp,
  singIn,
  createToken,
};

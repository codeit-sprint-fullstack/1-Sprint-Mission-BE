import * as userRepository from "../repositories/userRepository.js";
import { assert, PatchUser } from "../validations/structs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("없는 이메일이거나 비밀번호 입니다.");
    error.code = 404;
    throw error;
  }
  await verifyPassword(password, user.password);
  return user;
}

export async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.email);
  if (existedUser) {
    const error = new Error("이미 사용중인 이메일입니다");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);

  const newUser = await userRepository.create({
    email: user.email,
    nickname: user.nickname,
    encryptedPassword: hashedPassword,
  });
  const tokens = await updateTokens(newUser);
  return { ...newUser, ...tokens };
}

export function createToken(user, type = "access") {
  const payload = { userId: user.id };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h",
    algorithm: "HS256",
  };

  return jwt.sign(payload, secret, options);
}

export async function updateTokens(user) {
  if (!user || !user.id) {
    const error = new Error("id가 없어서 token을 만들수 없음.");
    error.code = 404;
    throw error;
  }
  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refresh");

  assert({ refreshToken }, PatchUser);

  const updatedUser = await userRepository.updateRefreshToken(
    user.id,
    refreshToken
  );
  return { ...updatedUser, accessToken };
}

export async function validateRefreshToken(userId, refreshToken) {
  const userFromDB = await userRepository.findById(userId);
  if (!userFromDB || userFromDB.refreshToken !== refreshToken) {
    const error = new Error("Not available token");
    error.code = 401;
    throw error;
  }

  return userFromDB;
}

export async function oauthCreateOrUpdate({
  provider,
  providerId,
  email,
  nickname,
}) {
  const user = await userRepository.createOrUpdateOauth({
    provider,
    providerId,
    email,
    nickname,
  });
  return user;
}

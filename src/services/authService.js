import { assert, CreateUser } from "../validations/structs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository.js";

async function filteredSensitiveUserData(user) {
  const { encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

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

export async function createUser(user) {
  assert(user, CreateUser);
  const existedUser = await userRepository.findByEmail(user.findByEmail);
  if (existedUser) {
    const error = new Error("이미 사용중인 이메일입니다");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);
  const createUser = await userRepository.create({
    ...user,
    encryptedPassword: hashedPassword,
  });

  return filteredSensitiveUserData(createUser);
}

export async function createToken(user) {
  const payload = { userId: user.userId };

  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h",
    algorithm: "HS256",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export async function validateRefreshToken(userId, refreshToken) {
  const userFromDB = await userRepository.findById(userId);
  if (!userFromDB || userFromDB.refreshToken !== refreshToken) {
    const error = new Error("Not available token");
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { accessToken, newRefreshToken };
}

export async function oauthCreateOrUpdate({
  provider,
  providerId,
  email,
  name,
}) {
  const user = await userRepository.createOrUpdateOauth({
    provider,
    providerId,
    email,
    name,
  });
  return filteredSensitiveUserData(user);
}

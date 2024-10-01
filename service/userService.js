import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (user, type) => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: type ? "1w" : "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const createUser = async (user) => {
  const existedUser = await userModel.findByEmail(user.email);

  if (existedUser) {
    const error = new Error("Unauthorized");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);
  const createUser = await userModel.create({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createUser);
};

const getUser = async (user) => {
  const existedUser = await userModel.findByEmail(user.email);

  if (!existedUser) {
    const error = new Error("회원 정보가 없습니다.");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  await verifyPassword(user.password, existedUser.password);
  return filterSensitiveUserData(existedUser);
};

const getUserById = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
};

const refreshToken = async (userId, refreshToken) => {
  const existedUser = await userModel.findById(userId);

  if (!existedUser || existedUser.refreshToken !== refreshToken) {
    const error = new Error("토큰이 유효하지 않습니다.");
    error.status = 401;
    error.data = { email: user.email };
    throw error;
  }

  const accessToken = createToken(existedUser);
  const newRefreshToken = createToken(existedUser, "refresh");

  return {
    accessToken,
    newRefreshToken,
  };
};

const updateUser = async (id, data) => {
  const user = await userModel.update(id, data);
  if (!user) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
};

const hashingPassword = async (password) => {
  // 함수 추가
  return bcrypt.hash(password, 10);
};

const filterSensitiveUserData = (user) => {
  const { password, refreshToken, ...rest } = user;
  return rest;
};

const verifyPassword = async (inputPassword, savedPassword) => {
  const isValid = await bcrypt.compare(inputPassword, savedPassword); // 변경
  if (!isValid) {
    const error = new Error("비밀번호가 일치 하지 않습니다.");
    error.code = 401;
    throw error;
  }
};

export default {
  createUser,
  getUser,
  getUserById,
  updateUser,
  refreshToken,
  createToken,
};

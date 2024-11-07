import userModel from "../repositorys/userRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { CustomError } from "../utils/interfaces/customError";
import passport from "passport";

interface UserData {
  email: string;
  password: string;
  nickname: string;
  refreshToken?: string;
}

type ResponseUser = Omit<User, "password" | "refreshToken">;

const createToken = (user: ResponseUser, type: string = "") => {
  const payload = { userId: user.id, email: user.email }; //jwt 토근 정도에 사용자의 id, email 정보를 담는다.
  const options = { expiresIn: type ? "1w" : "1h" }; //refresh 토큰의 경우 1주일, access 토근은 1시간의 유효성을 둔다
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

const createUser = async (user: UserData) => {
  const hashedPassword = await hashingPassword(user.password); //비밀번호 해싱후 저장
  const createUser = await userModel.create({
    ...user,
    password: hashedPassword, //해싱된 데이터로 변경
  });
  return filterSensitiveUserData(createUser);
};

const getUser = async (user: UserData) => {
  const existedUser = await userModel.findByEmail(user.email);

  if (!existedUser) {
    const error: CustomError = new Error("회원 정보가 없습니다.");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  await verifyPassword(user.password, existedUser.password); //리퀘스트의 비밀번호와 DB의 정보를 비교
  return filterSensitiveUserData(existedUser);
};

const getUserById = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
};

const refreshToken = async (userId: string, refreshToken: string) => {
  const existedUser = await userModel.findById(userId);
  if (!existedUser || existedUser.refreshToken !== refreshToken) {
    //DB의 정보가 없거나 쿠키로 받은 토큰과 DB의 저당된 토큰을 비교한다.
    const error: CustomError = new Error("토큰이 유효하지 않습니다.");
    error.status = 422;
    error.data = { refreshToken };
    throw error;
  } else {
    return existedUser;
  }
};

const updateRefreshToken = async (userId: string, refreshToken: string) => {
  const user = await userModel.updateRefreshToken(userId, refreshToken);
  if (!user) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
};

const hashingPassword = async (password: string) => {
  // 함수 추가
  return bcrypt.hash(password, 10);
};

const filterSensitiveUserData = (user: User) => {
  //리스폰스의 민감한 정보를 빼고 보낸다
  const { password, refreshToken, ...rest } = user;
  return rest;
};

const verifyPassword = async (inputPassword: string, savedPassword: string) => {
  const isValid = await bcrypt.compare(inputPassword, savedPassword); // 변경
  if (!isValid) {
    const error: CustomError = new Error("비밀번호가 일치 하지 않습니다.");
    error.status = 401;
    throw error;
  }
};

export default {
  createUser,
  getUser,
  getUserById,
  updateRefreshToken,
  refreshToken,
  createToken,
};

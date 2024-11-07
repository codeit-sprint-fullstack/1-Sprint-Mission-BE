import { Request } from "express";
import { CustomError } from "../middlewares/error-handler";
import userRepository from "../repositories/user-repository";
import { SignIn, SignUp } from "../struct/user-struct";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "../utills/auth-handler";
import { createToken, verifyRefreshToken } from "../utills/jwt-utill";
import { signInMapper } from "./mappers/auth-mpper";

interface SignUpData {
  email: string;
  nickname: string;
  encryptedPassword: string;
}

// 회원가입
async function signUp(data: SignUp) {
  const { email, nickname, password } = data;
  const existedUser = await userRepository.findFirstData({ where: { email } });

  if (existedUser) {
    const error: CustomError = new Error("User already exists");
    error.status = 422;
    error.data = email;
    throw error;
  }

  const encryptedPassword = await hashPassword(password);

  const userData: SignUpData = {
    email,
    nickname,
    encryptedPassword,
  };

  const user = await userRepository.createData({ data: userData });
  return filterSensitiveUserData(user);
}

// 로그인
async function signIn(data: SignIn) {
  const { email, password } = data;

  const user = await userRepository.findFirstData({ where: { email } });

  if (!user) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  await verifyPassword(password, user.encryptedPassword);
  const accessToken = await createToken(user);
  const refreshToken = await createToken(user, "refresh");

  await userRepository.updateData({
    where: { id: user.id },
    data: { refreshToken },
  });

  const response = signInMapper({ user, accessToken, refreshToken });

  return { response, refreshToken };
}

// 토큰 재발행
async function reissueToken(req: Request) {
  if (req.auth) {
    const { refreshToken } = req.cookies;
    const { userId } = req.auth;

    return await verifyRefreshToken(userId, refreshToken);
  } else {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

export default {
  signUp,
  signIn,
  reissueToken,
};

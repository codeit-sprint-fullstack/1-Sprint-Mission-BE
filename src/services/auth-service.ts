import { CustomError } from "../middlewares/error-handler";
import userRepository from "../repositories/user-repository";
import { SingUp } from "../struct/user-struct";
import { filterSensitiveUserData, hashPassword } from "../utills/auth-handler";

interface SingUpData {
  email: string;
  nickname: string;
  encryptedPassword: string;
}

// 회원 가입
async function singUp(data: SingUp) {
  const { email, nickname, password } = data;
  const existedUser = await userRepository.findFirstData({ where: { email } });

  if (existedUser) {
    const error: CustomError = new Error("User already exists");
    error.status = 422;
    error.data = email;
    throw error;
  }

  const encryptedPassword = await hashPassword(password);

  const userData: SingUpData = {
    email,
    nickname,
    encryptedPassword,
  };

  const user = await userRepository.createUser({ data: userData });
  return filterSensitiveUserData(user);
}

export default {
  singUp,
};

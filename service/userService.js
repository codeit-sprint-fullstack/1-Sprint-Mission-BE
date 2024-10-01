import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (user, type) => {
  const payload = { userId: user.id, email: user.email }; //jwt 토근 정도에 사용자의 id, email 정보를 담는다.
  const options = { expiresIn: type ? "1w" : "1h" }; //refresh 토큰의 경우 1주일, access 토근은 1시간의 유효성을 둔다
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const createUser = async (user) => {
  const existedUser = await userModel.findByEmail(user.email);

  if (existedUser) {
    //이미 사용중인 이메일인 경우 아래의 에러를 반환한다.
    const error = new Error("Unauthorized");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password); //비밀번호 해싱후 저장
  const createUser = await userModel.create({
    ...user,
    password: hashedPassword, //해싱된 데이터로 변경
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

  await verifyPassword(user.password, existedUser.password); //리퀘스트의 비밀번호와 DB의 정보를 비교
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
    //DB의 정보가 없거나 쿠키로 받은 토큰과 DB의 저당된 토큰을 비교한다.
    const error = new Error("토큰이 유효하지 않습니다.");
    error.status = 401;
    error.data = { email: user.email };
    throw error;
  }

  //토큰 재생성후 반환
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
  //리스폰스의 민감한 정보를 빼고 보낸다
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

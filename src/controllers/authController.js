import * as authService from "../services/authService.js";
import { cookieOptions } from "../config/authOptions.js";
import { assert, CreateUser } from "../validations/structs.js";

function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export const createLogin = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "비밀번호나 이메일이 일치하지 않습니다." });
  }

  const accessToken = authService.createToken(user);
  const refreshToken = authService.createToken(user, "refresh");

  const loggedInUser = await authService.updateUser(user.id, { refreshToken });

  res.cookie("refreshToken", refreshToken, cookieOptions);
  return res.json({ ...loggedInUser, accessToken });
};

export const createSignup = async (req, res) => {
  const userData = req.body;

  assert(userData, CreateUser);

  const user = await authService.createUser(userData);

  res.cookie("refreshToken", user.refreshToken, cookieOptions);

  const filteredData = filterSensitiveUserData(user);

  return res.status(201).json(filteredData);
};

export const createRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookieOptions;
  const { user } = req.user;
  const { accessToken, newRefreshToken } =
    await authService.validateRefreshToken(user.id, refreshToken);

  await authService.updateRefreshTokenOnDB(user.id, {
    refreshToken: newRefreshToken,
  });
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return res.json({ accessToken });
};

export const getGoogleLogin = async (req, res) => {
  const user = req.user;
  const accessToken = authService.createToken(user);
  const refreshToken = authService.createToken(user, "refresh");
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return res.json({ accessToken });
};

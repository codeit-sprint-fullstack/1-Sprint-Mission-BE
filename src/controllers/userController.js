import * as userService from "../services/userService";

const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};

export const getUser = async (req, res) => {};

export const createLogin = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "비밀번호나 이메일이 일치하지 않습니다." });
  }

  const accessToken = userService.createToken(user);
  const refreshToken = userService.createToken(user, "refresh");

  const loggedInUser = await userService.updateUser(user.id, { refreshToken });

  res.cookie("refreshToken", refreshToken, cookieOptions);
  return res.json({ ...loggedInUser, accessToken });
};

export const createSignup = async (req, res) => {
  user = await userService.createUser(req.body);
  return res.status(201).json(user);
};

export const createRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookieOptions;
  const { user } = req.user;
  const { accessToken, newRefreshToken } =
    await userService.validateRefreshToken(user.id, refreshToken);

  await userService.updateUser(user.id, { refreshToken: newRefreshToken });
  res.cookie("refreshToken", refreshToken, {
    cookieOptions,
  });
  return res.json({ accessToken });
};

export const getGoogleLogin = async (req, res) => {
  const user = req.user;
  const accessToken = userService.createToken(user);
  const refreshToken = userService.createToken(user, "refresh");
  res.cookie("refreshToken", refreshToken, {
    cookieOptions,
  });
  return res.json({ accessToken });
};

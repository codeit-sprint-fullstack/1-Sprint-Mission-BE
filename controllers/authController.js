import * as authService from "../services/authService.js";

const sendAuthResponse = (res, status, message, user, tokens) => {
  res.status(status).json({
    message,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { nickname, email, password } = req.body;
    const { newUser, tokens } = await authService.createUser(
      nickname,
      email,
      password
    );
    sendAuthResponse(res, 201, "User created successfully", newUser, tokens);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.getUserByEmail(email, password);
    sendAuthResponse(res, 200, "로그인 성공", user, tokens);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json({
      message: "리프레시 토큰이 성공적으로 갱신되었습니다.",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

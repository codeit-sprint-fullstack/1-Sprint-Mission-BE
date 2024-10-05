import * as authService from "../services/authService.js";
import { UnauthorizedError } from "../middlewares/errorMiddleware.js";

export const signUp = async (req, res) => {
  const user = await authService.signUp(req.body);
  res.status(201).json({ message: "회원가입이 완료되었습니다.", user });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.signIn(email, password);
  if (!result) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  res.json({ message: "로그인 성공", accessToken: result.accessToken });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  if (!result) {
    throw new UnauthorizedError("유효하지 않은 리프레시 토큰입니다.");
  }
  res.json(result);
};

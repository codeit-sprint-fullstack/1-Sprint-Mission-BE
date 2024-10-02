import * as authService from "../services/authService.js";

// 회원가입 컨트롤러
export const signUp = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;

    const { newUser, tokens } = await authService.createUser(
      nickname,
      email,
      password
    );

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      tokens,
    });
  } catch (err) {
    if (err.message === "이메일 또는 닉네임이 이미 사용중입니다.") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({
      message: "사용자 생성 중 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// 로그인 컨트롤러
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, tokens } = await authService.getUserByEmail(email, password);

    res.status(200).json({
      message: "로그인 성공",
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    if (err.message === "이메일과 비밀번호를 다시 확인해주세요") {
      return res.status(401).json({ message: err.message });
    }

    res.status(500).json({
      message: "로그인 중 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// 리프레시 토큰 갱신 컨트롤러
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const token = await authService.refreshToken(refreshToken);

    res.status(200).json({
      message: "리프레시 토큰이 성공적으로 갱신되었습니다.",
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

import { loginService, signupService } from '../service/authService.js';

export const signupController = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const newUser = await signupService({ email, password, nickname });
    return res.status(201).json({
      message: '회원가입 성공',
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await loginService({ email, password });
    return res.status(200).json({
      message: '로그인 성공',
      token,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

import { RequestHandler } from "express";
import { loginService, signupService } from "../service/authService";
import { LoginData, SignupData } from "../dto/auth.dto";

export const signupController: RequestHandler = async (req, res) => {
  const { email, password, nickname } = req.body as SignupData;

  try {
    const newUser = await signupService({ email, password, nickname });
    res.status(201).json({
      message: "회원가입 성공",
      user: newUser,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body as LoginData;

  try {
    const token = await loginService({ email, password });
    res.status(200).json({
      message: "로그인 성공",
      token,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

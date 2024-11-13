import { signUp, signIn, refreshAccessToken } from "../services/authService.js";

export async function signUpController(req, res, next) {
  try {
    const result = await signUp(req.body);

    return res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

export async function signInController(req, res, next) {
  try {
    const result = await signIn(req.user);

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken({ userId: req.id, refreshToken });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

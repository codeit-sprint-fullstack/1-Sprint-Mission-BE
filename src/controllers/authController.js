import * as authService from '../services/authService.js';
import { cookieOptions } from '../config/authOptions.js';
import { assert, CreateUser, validateLogin } from '../validations/structs.js';
import { filterUserData } from '../utils/utilFunctions.js';

export const createLogin = async (req, res) => {
  const user = req.body;

  const { email, password } = user;
  assert({ email, password }, validateLogin);

  const verifiedUser = await authService.getUser(email, password);

  const loggedInUser = await authService.updateTokens(verifiedUser);

  res.cookie('refreshToken', loggedInUser.refreshToken, cookieOptions);
  return res.json(filterUserData(loggedInUser));
};

export const createSignup = async (req, res) => {
  const userData = req.body;

  assert(userData, CreateUser);

  const newUser = await authService.createUser(userData);

  res.cookie('refreshToken', newUser.refreshToken, cookieOptions);
  const user = filterUserData(newUser);
  return res.status(201).json(user);
};

export const createRefreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  const user = req.user;
  const verifiedUser = await authService.validateRefreshToken(
    user.id,
    oldRefreshToken
  );

  const { accessToken, refreshToken } = await authService.updateTokens(
    verifiedUser
  );
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return res.json({ accessToken });
};

export const getGoogleLogin = async (req, res) => {
  const user = req.user;
  const { accessToken, refreshToken } = await authService.updateTokens(user);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return res.json({ accessToken });
};

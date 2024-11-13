import authRepository from "../repositories/authRepository.js";
import { createHashedPassword } from "../utils/authUtil.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import { authTokenForm, authUserForm } from "../mappers/auth-mapper.js";

export async function signUp({ password, ...rest }) {
  const hashedPassword = await createHashedPassword(password);
  const createdUser = await authRepository.createUser({
    ...rest,
    encryptedPassword: hashedPassword,
  });
  const accessToken = createAccessToken(createdUser.id);
  const refreshToken = createRefreshToken(createdUser.id);

  return authUserForm({
    accessToken,
    refreshToken,
    user: createdUser,
  });
}

export async function signIn(userData) {
  const user = userData;
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  return authUserForm({
    accessToken,
    refreshToken,
    user,
  });
}

export async function refreshAccessToken({ userId, refreshToken }) {
  const accessToken = createAccessToken(userId);

  return authTokenForm({ accessToken, refreshToken });
}

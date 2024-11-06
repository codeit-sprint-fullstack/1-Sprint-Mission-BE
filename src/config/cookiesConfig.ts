import { CookieOptions } from "express";

const accessTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // 개발환경에서만 적용
  maxAge: 1000 * 60 * 60, //1시간
};

const refreshTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // 개발환경에서만 적용
  maxAge: 1000 * 60 * 60 * 24, //1일,
};

const clearAccessTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // 개발환경에서만 적용
  maxAge: 0, //1시간
};

const clearRefreshTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // 개발환경에서만 적용
  maxAge: 0, //1일,
};

export default {
  accessTokenOption,
  refreshTokenOption,
  clearAccessTokenOption,
  clearRefreshTokenOption,
};

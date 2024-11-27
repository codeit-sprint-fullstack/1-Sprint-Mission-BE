import {
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import userService from "../../services/userService";
import { Request } from "express";
import { CustomError } from "../../utils/interfaces/customError";
import { JWT_SECRET } from "../../env";

interface JwtPayload {
  userId: string; // JWT 페이로드에 포함된 userId
  email: string;
}

const accessExtractor = (req: Request) => {
  const cookieString = req.headers.cookie;
  let accessToken = "";
  if (cookieString) {
    if (cookieString.startsWith("access-token=")) {
      const cookie = cookieString
        .split("; ")
        .find((cookie) => cookie.startsWith("access-token=")) as string;
      if (cookie) {
        accessToken = cookie.split("=")[1];
      }
    }
  }

  if (!cookieString || !accessToken) {
    const error: CustomError = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "유효하지 않은 액세스 토큰입니다.",
      "access-token": accessToken,
    };
    throw error;
  }

  return accessToken;
};

const refreshExtractor = (req: Request) => {
  const cookieString = req.headers.cookie;
  let refreshToken = "";
  if (cookieString) {
    const cookie = cookieString
      .split("; ")
      .find((cookie) => cookie.startsWith("refresh-token=")) as string;
    if (cookie) {
      refreshToken = cookie.split("=")[1];
    }
  }
  if (!cookieString || !refreshToken) {
    const error: CustomError = new Error("Forbidden");
    error.status = 403;
    error.data = {
      message: "유효하지 않은 리플레쉬 토큰입니다.",
      "refresh-token": refreshToken,
    };
    throw error;
  }
  return refreshToken;
};

const accessTokenOptions: StrategyOptions = {
  jwtFromRequest: accessExtractor,
  secretOrKey: JWT_SECRET as string,
};

const refreshTokenOptions: StrategyOptions = {
  jwtFromRequest: refreshExtractor,
  secretOrKey: JWT_SECRET as string,
};

async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
  const { userId } = payload;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

//리퀘스트의 사용자 정보를 담아줌  -> req.user
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);
export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);

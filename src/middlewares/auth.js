import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import { createCustomError } from "../lib/error.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";
import { userSelect } from "../structs/res-template.js";

/** validate authorizaton(accessToken) */
export function validateAccessToken(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return next(createCustomError({ status: 401, message: "Unauthorized" }));
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // 임시로 403으로 처리하는게 좋아보이지만, fe에서 401만 처리해서 임시로 401 코드로 사용
      return next(
        createCustomError({ status: 401, message: "Invalid Access Token" })
      );
    }

    req.id = decoded.id;

    return next();
  });
}

/** validate refreshToken
 * POST /users/refresh-token 과정에 사용
 */
export function validateRefreshToken(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    // 임시로 403으로 처리하는게 좋아보이지만, fe에서 401만 처리해서 임시로 401 코드로 사용
    return next(
      createCustomError({ status: 401, message: "Invalid Refresh Token" })
    );
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // 임시로 403으로 처리하는게 좋아보이지만, fe에서 401만 처리해서 임시로 401 코드로 사용
      return next(
        createCustomError({ status: 401, message: "Invalid Refresh Token" })
      );
    }

    req.id = decoded.id;

    return next();
  });
}

/** check authorization
 * 유효한 토큰 포함시 userId를 추가하여 userId를 기반으로 하는 data 처리
 * 유효한 토큰 미포함시 userId를 기반으로 하는 data 미처리
 * ex > getProducts : userId 포함시 userId기준으로 상품/게시글의 좋아요 정보 추가 리턴
 */
export function includeToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.id = null;
      return next();
    }

    req.id = decoded.id;

    return next();
  });
}

/** POST /users/sign-in 과정에 사용 */
export function validateEmailPassword(req, res, next) {
  const prisma = new PrismaClient();
  const { email, password } = req.body;

  prisma.user
    .findUnique({
      where: { email },
      select: {
        ...userSelect,
        encryptedPassword: true,
      },
    })
    .then((data) => {
      if (!data) {
        // 잘못된 email
        return next(
          createCustomError({
            status: 400,
            message: "잘못된 email or password 입니다",
          })
        );
      }

      return bcrypt
        .compare(password, data.encryptedPassword)
        .then((isCorrect) => {
          if (!isCorrect) {
            // 잘못된 password
            return next(
              createCustomError({
                status: 400,
                message: "잘못된 email or password 입니다",
              })
            );
          }

          const { encryptedPassword, ...user } = data;
          req.user = user;

          return next();
        });
    });
}

/** PATCH users/password 과정에서 사용 */
export function validateIdPassword(req, res, next) {
  const prisma = new PrismaClient();
  const { currentPassword } = req.body;

  console.log("validateIdPassword req.id : ", req.id);
  prisma.user
    .findUnique({
      where: { id: req.id },
      select: {
        ...userSelect,
        encryptedPassword: true,
      },
    })
    .then((data) => {
      if (!data) {
        // 잘못된 id
        return next(
          createCustomError({
            status: 400,
            message: "잘못된 id 입니다",
          })
        );
      }

      return bcrypt
        .compare(currentPassword, data.encryptedPassword)
        .then((isCorrect) => {
          if (!isCorrect) {
            // 잘못된 password
            return next(
              createCustomError({
                status: 400,
                message: "잘못된 password 입니다",
              })
            );
          }

          return next();
        })
        .catch((err) => {
          return next(err);
        });
    });
}

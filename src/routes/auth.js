import express from "express";
import { PrismaClient } from "@prisma/client";

import {
  validateEmailPassword,
  validateRefreshToken,
} from "../middlewares/auth.js";
import { createHashedPassword } from "../lib/password.js";
import { createAccessToken, createRefreshToken } from "../lib/token.js";
import { userSelect } from "../responses/user-res.js";
import { authUserForm, authTokenForm } from "../mappers/auth-mapper.js";

const prisma = new PrismaClient();
const authRouter = express.Router();

/** POST /auth/sign-up */
authRouter.post("/sign-up", (req, res, next) => {
  const { password, ...data } = req.body;
  createHashedPassword(password).then((hashedPassword) => {
    prisma.user
      .create({
        data: { encryptedPassword: hashedPassword, ...data },
        select: userSelect,
      })
      .then((createdData) => {
        const accessToken = createAccessToken(createdData.id);
        const refreshToken = createRefreshToken(createdData.id);
        const result = authUserForm({
          accessToken,
          refreshToken,
          user: createdData,
        });

        return res.status(201).send(result);
      })
      .catch((err) => {
        next(err);
      });
  });
});

/** POST /auth/sign-in */
authRouter.post("/sign-in", validateEmailPassword, (req, res, next) => {
  /* validateEmailPassword DB에서 user 정보를 찾으니까, 여기서 한 번 더 DB 접근하는거 보다, 
   그냥 validateEmailPassword 유저 정보를 넘겨줌
   넘겨주기는 하는네, 함수명을 생각하면 좋은건지는 모르겠네
   */
  const user = req.user;
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  const result = authUserForm({
    accessToken,
    refreshToken,
    user,
  });

  return res.status(200).send(result);
});

// 임시로 로그인할 때만 refresh 토큰 발급 : refresh-token을 be에서 관리하지 못한다면 발급을 제한하는 것으로 제한
/** POST /auth/refresh-token */
authRouter.post("/refresh-token", validateRefreshToken, (req, res, next) => {
  const { refreshToken } = req.body;

  const accessToken = createAccessToken(req.id);
  // const refreshToken = createRefreshToken(userId);
  const result = authTokenForm({ accessToken, refreshToken });

  return res.status(200).send(result);
});

export default authRouter;

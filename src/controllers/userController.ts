import express, { Request, Response, NextFunction } from "express";
import { asyncHandle } from "../utils/errorUtils";
import userService from "../services/userService";
import cookiesConfig from "../config/cookiesConfig";
import passport from "../config/passportConfig";
import { User } from "@prisma/client";
import authUser from "../middlewares/authUser";

const router = express.Router();

router.get(
  "/me",
  passport.authenticate("access-token", { session: false }), //passport 사용 토큰이 유효하다면 리퀘스트의 user로 담긴다
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user as { id: string };
      const user = await userService.getUserById(userId);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/signup",
  authUser.verifyUserSignup, //유효성 검사
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.createUser(req.body);
      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh-token");

      //리스폰스의 쿠키에 담아 전달
      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        refreshToken,
        cookiesConfig.accessTokenOption
      );

      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/login",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUser(req.body);
      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh-token");

      //Db의 갱신된 리프레쉬 토큰 저장
      await userService.updateRefreshToken(user.id, refreshToken);

      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        refreshToken,
        cookiesConfig.accessTokenOption
      );

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/refresh-token",
  //클라이언트의 인터셉터의 401이 아닌 403을 잡기위한 커스텀 콜밸
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "refresh-token",
      { session: false },
      (err: Error, user: User) => {
        if (err || !user) {
          return res.status(403).send({ message: "토근만료" });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.user as { id: string };
      const cookieString = req.headers.cookie;

      let refreshToken: string = "";
      if (cookieString) {
        const cookie = cookieString
          .split("; ")
          .find((cookie) => cookie.startsWith("refresh-token=")) as string;
        if (cookie) {
          refreshToken = cookie.split("=")[1];
        }
      }

      if (!refreshToken) {
        res.status(403).send({ message: "리프레쉬 토큰이 없습니다." });
      }

      //전달 받은 토큰의 사용자와 리프레쉬 토큰을 전달 > 갱신후 반환값 사용
      const existedUser = await userService.refreshToken(userId, refreshToken);
      if (existedUser) {
        const accessToken = userService.createToken(existedUser);
        const newRefreshToken = userService.createToken(existedUser, "refresh");
        //DB의 갱신된 리프레쉬 토큰 저장
        const nextUser = await userService.updateRefreshToken(
          userId,
          newRefreshToken
        );

        res.cookie(
          "access-token",
          accessToken,
          cookiesConfig.accessTokenOption
        );
        res.cookie(
          "refresh-token",
          newRefreshToken,
          cookiesConfig.accessTokenOption
        );
        res.status(200).send({ message: "토큰갱신" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

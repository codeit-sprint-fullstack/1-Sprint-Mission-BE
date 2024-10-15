import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import userService from "../service/userService.js";
import cookiesConfig from "../config/cookiesConfig.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.get(
  "/me",
  //passport 사용 토큰이 유효하다면 리퀘스트의 user로 담긴다
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.user.id);
      return res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/signup",
  asyncHandle(async (req, res, next) => {
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

      return res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/login",
  asyncHandle(async (req, res, next) => {
    try {
      const user = await userService.getUser(req.body);
      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh-token");

      //Db의 갱신된 리프레쉬 토큰 저장
      const nextUser = await userService.updateUser(user.id, {
        refreshToken,
      });

      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        refreshToken,
        cookiesConfig.accessTokenOption
      );

      return res.status(200).send(nextUser);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/refresh-token",
  //클라이언트의 인터셉터의 401이 아닌 403을 잡기위한 커스텀 콜밸
  (req, res, next) => {
    passport.authenticate("refresh-token", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(403).send({ message: "토근만료" });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res, next) => {
    try {
      console.log("in refresh-token router");
      const { id: userId } = req.user;
      let refreshToken = "";
      if (req.cookies["refresh-token"]) {
        refreshToken = req.cookies["refresh-token"];
      } else {
        refreshToken = req.headers.refreshtoken;
      }

      //전달 받은 토큰의 사용자와 리프레쉬 토큰을 전달 > 갱신후 반환값 사용
      const existedUser = await userService.refreshToken(userId, refreshToken);
      if (existedUser) {
        const accessToken = userService.createToken(existedUser);
        const newRefreshToken = userService.createToken(existedUser, "refresh");
        //Db의 갱신된 리프레쉬 토큰 저장
        const newUser = await userService.updateUser(userId, {
          refreshToken: newRefreshToken,
        });

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
        res.status(200).send({ ...newUser });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

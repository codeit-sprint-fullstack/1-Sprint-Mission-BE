import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import userService from "../service/userService.js";
import cookiesConfig from "../config/cookiesConfig.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.get(
  "/me",
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

router.get(
  "/refresh-token",
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
      const { id: userId } = req.user;
      const refreshToken = req.cookies.refreshToken;

      const { accessToken, newRefreshToken } = await userService.refreshToken(
        userId,
        refreshToken
      );

      const user = await userService.updateUser(userId, {
        refreshToken: newRefreshToken,
      });

      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        newRefreshToken,
        cookiesConfig.accessTokenOption
      );
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // JWT 토큰 생성을 위한 라이브러리
import passport from "passport"; // 구글 OAuth 전략을 설정
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // 구글 OAuth 전략을 설정
import errorHandler from "../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import * as authController from "../controllers/authController.js"; // 컨트롤러 import

const prisma = new PrismaClient();
const router = express.Router();

// 사용자 정보를 세션에 저장하기 위한 과정(사용자 직렬화)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 세션에 저장된 정보를 기반으로 사용자 정보를 복원하는 과정(사용자 역직렬화)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// 구글 OAuth 전략 설정
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/auth/google/callback", // 구글에서 리다이렉트할 URL
    },
    async (accessToken, refreshToken, profile, done) => {
      // 사용자 생성 또는 조회 로직
      const user = await prisma.user.upsert({
        where: { googleId: profile.id }, // Google ID를 기준으로 사용자 조회
        update: {},
        create: {
          email: profile.emails[0].value,
          nickname: profile.displayName,
          googleId: profile.id, // Google ID 저장
        },
      });
      done(null, user);
    }
  )
);

// 구글 로그인 요청
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// 구글 로그인 콜백
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // 성공적으로 로그인된 후, JWT 토큰 생성 및 응답
    const token = jwt.sign(
      { userId: req.user.id, nickname: req.user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:3000?token=${token}`); // 프론트엔드 URL로 리다이렉트
  }
);

// 회원가입 API
router.route("/signUp").post(authController.signup);

// 로그인 API
router.route("/login").post(authController.login);

// 리프레시 토큰으로 새로운 액세스 토큰 발급
router.post("/refresh", authController.refreshAccessToken);

// 리프레시 토큰 삭제 (로그아웃 시 등)
router.delete("/logout", authController.logout);

// 사용자 정보 가져오기 API (현재 사용자)
router.get("/me", authController.getCurrentUser);

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;

import { Strategy as JwtStrategy } from "passport-jwt";
import userService from "../../service/userService.js";

const accessExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["access-token"];
  }
  return token;
};

const refreshExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["refresh-token"];
  }
  return token;
};

const accessTokenOptions = {
  jwtFromRequest: accessExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: refreshExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload, done) {
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

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);
export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);

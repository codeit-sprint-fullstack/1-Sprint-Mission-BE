import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as userService from "../../services/userService";

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ["HS256"],
};

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["refreshToken"];
  }
  return token;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ["HS256"],
};

async function jwtVerify(payload, done) {
  try {
    const user = await userService.getUserById(payload.userId);
    if (!user) {
      return done(error, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export default {
  accessTokenStrategy,
  refreshTokenStrategy,
};

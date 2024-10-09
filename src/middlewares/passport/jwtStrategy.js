import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getUserById } from '../../services/userService.js';

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
};

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  return token;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
};

async function jwtVerify(payload, done) {
  try {
    const { userId } = payload;

    if (!userId) {
      const error = new Error('JWT인증: userId가 없습니다.');
      return done(error, false);
    }
    const user = await getUserById(userId);
    if (!user) {
      const error = new Error('JWT인증: user가 없습니다.');
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

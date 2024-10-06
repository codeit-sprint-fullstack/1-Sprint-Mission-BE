import passport from "passport";

import localStrategy from "../middlewares/passport/localStrategy.js";
import jwtStrategy from "../middlewares/passport/jwtStrategy.js";
import googleStrategy from "../middlewares/passport/googleStrategy.js";

passport.use("local", localStrategy);

passport.use("access-token", jwtStrategy.accessTokenStrategy);
passport.use("refresh-token", jwtStrategy.refreshTokenStrategy);

passport.use("google", googleStrategy);

export default passport;

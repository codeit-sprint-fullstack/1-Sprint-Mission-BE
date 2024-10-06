import passport from "passport";

import localStrategy from "../middlewares/passport/localStrategy";
import jwtStrategy from "../middlewares/passport/jwtStrategy";
import googleStrategy from "../middlewares/passport/googleStrategy";

passport.use("local", localStrategy);

passport.use("access-token", jwtStrategy.accessTokenStrategy);
passport.use("refresh-token", jwtStrategy.refreshTokenStrategy);

passport.use("google", googleStrategy);

export default passport;

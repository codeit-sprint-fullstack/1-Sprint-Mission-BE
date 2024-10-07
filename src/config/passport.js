import passport from "passport";

import jwtStrategy from "../middlewares/passport/jwtStrategy.js";
import googleStrategy from "../middlewares/passport/googleStrategy.js";

passport.use("access-token", jwtStrategy.accessTokenStrategy);
passport.use("refresh-token", jwtStrategy.refreshTokenStrategy);

passport.use("google", googleStrategy);

export default passport;

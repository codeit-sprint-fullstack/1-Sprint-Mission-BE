import GoogleStrategy from "passport-google-oauth20";

import * as authService from "../../services/authService.js";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

async function verify(accessToken, refreshToken, profile, done) {
  try {
    const user = await authService.oauthCreateOrUpdate({
      provider: profile.provider,
      providerId: profile.id,
      email: profile.email[0].value,
      nickname: profile.displayName,
    });

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;

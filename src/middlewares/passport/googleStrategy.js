import GoogleStrategy from "passport-google-oauth20";

import * as authService from "../../services/authService.js";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

async function verify(accessToken, refreshToken, profile, done) {
  try {
    const user = await authService.oauthCreateOrUpdate(
      profile.provider,
      profile.id,
      profile.email[0].value,
      profile.displayName
    );

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;

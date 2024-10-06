import { Strategy as LocalStrategy } from "passport-local";
import * as userService from "../../services/userService.js";

const localStrategy = new LocalStrategy(
  {
    userNameField: "email",
  },
  async (email, password, done) => {
    try {
      const user = await userService.getUser(email, password);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;

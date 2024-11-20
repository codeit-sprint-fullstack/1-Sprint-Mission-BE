import * as s from "superstruct";
import isEmail from "is-email";

const emailValidator = s.refine(s.string(), "email", (value) => {
  return isEmail(value);
});

const authUserBody = {
  email: emailValidator,
  password: s.size(s.string(), 8, 16),
};

const signUpUser = s.object({
  ...authUserBody,
  nickname: s.size(s.string(), 1, Infinity),
});

const signInUser = s.object({
  ...authUserBody,
});

type SignUp = s.Infer<typeof signUpUser>;
type SignIn = s.Infer<typeof signInUser>;

export { signUpUser, signInUser, SignUp, SignIn };

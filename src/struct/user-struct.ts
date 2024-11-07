import * as s from "superstruct";
import isEmail from "is-email";

const emailValidator = s.refine(s.string(), "email", (value) => {
  return isEmail(value);
});

const authUserBody = {
  email: emailValidator,
  password: s.size(s.string(), 8, 16),
};

const singUpUser = s.object({
  ...authUserBody,
  nickname: s.size(s.string(), 1, Infinity),
});

const singInUser = s.object({
  ...authUserBody,
});

type SingUp = s.Infer<typeof singUpUser>;
type SingIn = s.Infer<typeof singInUser>;

export { singUpUser, singInUser, SingUp, SingIn };

import * as s from "superstruct";

const authUserBody = {
  email: s.size(s.string(), 1, Infinity),
  password: s.size(s.string(), 8, 16),
};

const singUpUser = s.object({
  ...authUserBody,
  nickname: s.size(s.string(), 1, Infinity),
});

const singInUser = s.object({
  ...authUserBody,
});

type SingUp = s.Infer<typeof singUpUser>
type SingIn = s.Infer<typeof singInUser>

export { singUpUser, singInUser, SingUp, SingIn };
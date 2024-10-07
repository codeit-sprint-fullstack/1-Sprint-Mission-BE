import * as s from "superstruct";

const authUserBody = {
  email: s.size(s.size(s.string(), 1, Infinity)),
  password: s.size(s.string(), 1, 16),
};

const singUpUser = s.object({
  ...authUserBody,
  nickname: s.size(s.string, 1, Infinity),
});

export { singUpUser };

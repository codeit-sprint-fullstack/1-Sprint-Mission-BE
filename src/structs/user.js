import * as ss from "superstruct";

import { userSchema } from "../constants/user.js";
import { emailPattern } from "../pattern/pattern.js";

export const User = ss.object({
  name: ss.size(
    ss.string(),
    userSchema.MIN_LENGTH_NAME,
    userSchema.MAX_LENGTH_NAME
  ),
  nickname: ss.size(
    ss.string(),
    userSchema.MIN_LENGTH_NICKNAME,
    userSchema.MAX_LENGTH_NICKNAME
  ),
  email: ss.refine(
    emailPattern,
    "Email Length",
    (value) =>
      userSchema.MIN_LENGTH_EMAIL <= value.length &&
      value.length <= userSchema.MAX_LENGTH_EMAIL
  ),
  password: ss.size(
    ss.string(),
    userSchema.MIN_LENGTH_PASSWORD,
    userSchema.MAX_LENGTH_PASSWORD
  ),
});

export const EmailPassword = ss.object({
  email: ss.refine(
    emailPattern,
    "Email Length",
    (value) =>
      userSchema.MIN_LENGTH_EMAIL <= value.length &&
      value.length <= userSchema.MAX_LENGTH_EMAIL
  ),
  password: ss.size(
    ss.string(),
    userSchema.MIN_LENGTH_PASSWORD,
    userSchema.MAX_LENGTH_PASSWORD
  ),
});

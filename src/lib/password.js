import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../constants/password.js";

export async function createHashedPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hasedPassword = await bcrypt.hash(password, salt);

  return hasedPassword;
}

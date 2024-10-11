import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../constants/token.js";

export async function createHashedPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hasedPassword = await bcrypt.hash(password, salt);

  return hasedPassword;
}

export async function validatePassword({ passwordInput, encryptedPassword }) {
  return await bcrypt.compare(passwordInput, encryptedPassword);
}

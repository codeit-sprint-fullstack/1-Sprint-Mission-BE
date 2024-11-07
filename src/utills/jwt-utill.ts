import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

async function createToken(user: User, type: string) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export default {
  createToken,
};

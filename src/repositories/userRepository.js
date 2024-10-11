import prisma from "./prisma.js";
import { userSelect } from "../responses/user-res.js";

async function updateUserPasswordByUserId({ userId, newHashedPassword }) {
  return await prisma.user.update({
    where: { id: userId },
    data: { newHashedPassword },
    select: userSelect,
  });
}

export default { updateUserPasswordByUserId };

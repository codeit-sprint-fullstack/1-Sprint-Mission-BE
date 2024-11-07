import { User } from "@prisma/client";
import { filterSensitiveUserData } from "../../utills/auth-handler";

type SignInMapper = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export function signInMapper({
  user,
  accessToken,
  refreshToken,
}: SignInMapper) {
  const userDataByFilter = filterSensitiveUserData(user);

  return {
    user: userDataByFilter,
    Token: {
      accessToken,
      refreshToken,
    },
  };
}

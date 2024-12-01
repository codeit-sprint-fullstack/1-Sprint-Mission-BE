import { userIndetificationInfo, UserTokenInfo } from "../../types/user-types";

export function userIndetificationInfoMapper({
  userInfo,
  accessToken,
  refreshToken,
}: {
  userInfo: userIndetificationInfo;
  accessToken: string;
  refreshToken: string;
}): UserTokenInfo {
  return {
    id: userInfo.id,
    nickname: userInfo.nickname,
    name: userInfo.name,
    email: userInfo.email,
    image: userInfo.image,
    createdAt: userInfo.createdAt,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

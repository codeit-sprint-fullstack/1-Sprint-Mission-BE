import { Prisma } from "@prisma/client";

export interface UserSignInData {
  email: string;
  password: string;
}

export interface UserSignUpData extends UserSignInData {
  nickname: string;
  name: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface Tokens extends RefreshToken {
  accessToken: string;
}

export interface UserBaseInfo {
  id: string;
  nickname: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface userIndetificationInfo extends UserBaseInfo {
  encryptedPassword: string;
}

export interface UserTokenInfo extends UserBaseInfo, Tokens {}

export interface UserCommentInfo {
  id: string;
  nickname: string;
  image: string | null;
}

interface UserCreateInput {
  data: Prisma.UserCreateInput;
}
interface UserUpdateInput {
  data: Prisma.UserUpdateInput;
}
interface UserSelect {
  select?: Prisma.UserSelect;
}
interface UserWhereUniqueInpu {
  where: Prisma.UserWhereUniqueInput;
}

export interface UserCreateDataParam extends UserCreateInput, UserSelect {}

export interface UserFindUniqueDataParam
  extends UserWhereUniqueInpu,
    UserSelect {}

export interface UserUpdateDataParam
  extends UserWhereUniqueInpu,
    UserUpdateInput,
    UserSelect {}

export interface ModifyUserParam {
  userId: string;
  nickname: string | null;
  image: string | null;
  password: string | null;
}

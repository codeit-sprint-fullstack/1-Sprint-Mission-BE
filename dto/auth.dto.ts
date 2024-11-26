import { User as PrismaUser } from "@prisma/client";

export type FindUserEmailParams = Pick<PrismaUser, "email">;

export type CreateUserParams = Pick<
  PrismaUser,
  "email" | "encryptedPassword" | "nickname"
>;

export type FindUserIdParams = Pick<PrismaUser, "id">;

export type SignupData = {
  email: string;
  nickname: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PrismaUser;
}

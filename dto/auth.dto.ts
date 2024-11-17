import { User as PrismaUser } from "@prisma/client";

export type FindUserEmailParams = Pick<PrismaUser, "email">;

export type CreateUserParams = Pick<
  PrismaUser,
  "email" | "encryptedPassword" | "nickname"
>;

export type FindUserIdParams = Pick<PrismaUser, "id">;

export type SignupData = Pick<PrismaUser, "email" | "nickname"> & {
  password: string;
};

export type LoginData = Pick<PrismaUser, "email"> & { password: string };

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PrismaUser;
}

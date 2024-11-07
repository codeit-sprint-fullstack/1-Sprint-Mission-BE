import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

type UserSelectType = Prisma.UserSelect;

type UserPayLoad<T extends UserSelectType | undefined> = Prisma.UserGetPayload<{
  select: T;
}>;

// findFirstData
function findFirstData<T extends UserSelectType>({
  where,
  select,
}: {
  where: Prisma.UserWhereInput;
  select: T;
}): Promise<UserPayLoad<T> | null>;
function findFirstData({
  where,
}: {
  where: Prisma.UserWhereInput;
}): Promise<UserPayLoad<undefined> | null>;

async function findFirstData<T extends UserSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.UserWhereInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.user.findFirst({ where });
  }
  return await prisma.user.findFirst({ where, select });
}

// createUser
function createUser<T extends UserSelectType>({
  data,
  select,
}: {
  data: Prisma.UserCreateInput;
  select: T;
}): Promise<UserPayLoad<T>>;
function createUser({
  data,
}: {
  data: Prisma.UserCreateInput;
}): Promise<UserPayLoad<undefined>>;

async function createUser<T extends UserSelectType | undefined>({
  data,
  select,
}: {
  data: Prisma.UserCreateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.user.create({ data });
  }
  return await prisma.user.create({ data, select });
}

export default {
  findFirstData,
  createUser,
};

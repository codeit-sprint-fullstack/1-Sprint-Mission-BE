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

// createData
function createData<T extends UserSelectType>({
  data,
  select,
}: {
  data: Prisma.UserCreateInput;
  select: T;
}): Promise<UserPayLoad<T>>;
function createData({
  data,
}: {
  data: Prisma.UserCreateInput;
}): Promise<UserPayLoad<undefined>>;

async function createData<T extends UserSelectType | undefined>({
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

// findUniqueOrThrowtData
function findUniqueOrThrowtData<T extends UserSelectType>({
  where,
  select,
}: {
  where: Prisma.UserWhereUniqueInput;
  select: T;
}): Promise<UserPayLoad<T>>;
function findUniqueOrThrowtData({
  where,
}: {
  where: Prisma.UserWhereUniqueInput;
}): Promise<UserPayLoad<undefined>>;

async function findUniqueOrThrowtData<T extends UserSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.UserWhereUniqueInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.user.findUniqueOrThrow({ where });
  }
  return await prisma.user.findUniqueOrThrow({ where, select });
}

// updateData
function updateData<T extends UserSelectType>({
  where,
  data,
  select,
}: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
  select: T;
}): Promise<UserPayLoad<T>>;
function updateData({
  where,
  data,
}: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}): Promise<UserPayLoad<undefined>>;

async function updateData<T extends UserSelectType | undefined>({
  where,
  data,
  select,
}: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.user.update({ where, data });
  }
  return await prisma.user.update({ where, data, select });
}

export default {
  findFirstData,
  createData,
  findUniqueOrThrowtData,
  updateData,
};

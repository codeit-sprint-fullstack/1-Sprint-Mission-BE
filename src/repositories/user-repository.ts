import { User } from "@prisma/client";

import prisma from "./prisma";
import {
  UserCreateDataParam,
  UserFindUniqueDataParam,
  UserUpdateDataParam,
} from "../types/user-types";

async function createData({
  data,
  select,
}: UserCreateDataParam): Promise<User> {
  return await prisma.user.create({ data, select });
}

async function findUniqueData({
  where,
  select,
}: UserFindUniqueDataParam): Promise<User | null> {
  return await prisma.user.findUnique({ where, select });
}

async function findUniqueOrThrowData({
  where,
  select,
}: UserFindUniqueDataParam): Promise<User> {
  return await prisma.user.findUniqueOrThrow({ where, select });
}

async function updateData({
  where,
  data,
  select,
}: UserUpdateDataParam): Promise<Partial<User>> {
  return await prisma.user.update({ where, data, select });
}

export default {
  createData,
  findUniqueData,
  findUniqueOrThrowData,
  updateData,
};

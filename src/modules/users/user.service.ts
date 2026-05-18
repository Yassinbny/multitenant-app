import { UserRole } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import { hashPassword } from "../../utils/password.js";
import type { CreateUserInput } from "./user.schemas.js";

type AuthUser = {
  userId: string;
  tenantId: string;
};

export const createUser = async (
  input: CreateUserInput,
  authUser: AuthUser,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      role: UserRole.USER,
      tenantId: authUser.tenantId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUsers = async (authUser: AuthUser) => {
  return prisma.user.findMany({
    where: {
      tenantId: authUser.tenantId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const deleteUser = async (userId: string, authUser: AuthUser) => {
  if (userId === authUser.userId) {
    throw new AppError(400, "You cannot delete yourself");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId: authUser.tenantId,
      role: UserRole.USER,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
};

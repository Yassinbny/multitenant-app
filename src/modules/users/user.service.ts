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

import { prisma } from "../../config/database.js";
import { UserRole } from "@prisma/client";
import { AppError } from "../../utils/errors.js";
import { hashPassword } from "../../utils/password.js";
import type {
  CreateTenantInput,
  CreateTenantAdminInput,
} from "./tenant.schemas.js";

export const createTenant = async (input: CreateTenantInput) => {
  const existingTenant = await prisma.tenant.findUnique({
    where: {
      name: input.name,
    },
  });

  if (existingTenant) {
    throw new AppError(409, "Tenant already exists");
  }

  return prisma.tenant.create({
    data: {
      name: input.name,
    },
  });
};

export const getTenants = async () => {
  return prisma.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTenantById = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new AppError(404, "Tenant not found");
  }

  return tenant;
};

export const createTenantAdmin = async (
  tenantId: string,
  input: CreateTenantAdminInput,
) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new AppError(404, "Tenant not found");
  }

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
      role: UserRole.ADMIN,
      tenantId: tenant.id,
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

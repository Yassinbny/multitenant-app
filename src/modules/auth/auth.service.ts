import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword } from "../../utils/password.js";
import type { LoginInput } from "./auth.schemas.js";

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const isPasswordValid = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = signToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
};

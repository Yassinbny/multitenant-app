import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { AppError } from "../utils/errors.js";

export const requireRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };

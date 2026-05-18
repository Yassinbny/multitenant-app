import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors.js";
import * as userService from "./user.service.js";

const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return {
    userId: req.user.userId,
    tenantId: req.user.tenantId,
  };
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const user = await userService.createUser(req.body, authUser);

    res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const users = await userService.getUsers(authUser);

    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

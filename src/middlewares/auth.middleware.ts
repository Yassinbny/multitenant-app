import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(401, "Missing authorization header");
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError(401, "Invalid authorization header");
  }

  const payload = verifyToken(token);

  req.user = payload;

  next();
};

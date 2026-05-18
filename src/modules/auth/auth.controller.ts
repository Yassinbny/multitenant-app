import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const me = (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
};

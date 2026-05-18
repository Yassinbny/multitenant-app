import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
  userId: string;
  tenantId: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
};

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};

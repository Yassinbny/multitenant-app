import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema } from "./auth.schemas.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.me);
export default router;

import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as userController from "./user.controller.js";
import { createUserSchema } from "./user.schemas.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRoles("ADMIN"));

router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", userController.getUsers);

export default router;

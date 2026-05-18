import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as tenantController from "./tenant.controller.js";
import {
  createTenantAdminSchema,
  createTenantSchema,
} from "./tenant.schemas.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRoles("SUPER_ADMIN"));

router.post("/", validate(createTenantSchema), tenantController.createTenant);
router.get("/", tenantController.getTenants);
router.post(
  "/:tenantId/admins",
  validate(createTenantAdminSchema),
  tenantController.createTenantAdmin,
);
router.get("/:id", tenantController.getTenantById);

export default router;

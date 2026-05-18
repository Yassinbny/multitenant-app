import { Router } from "express";
import * as submissionController from "./submission.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createSubmissionSchema } from "./submission.schemas.js";
import { requireRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRoles("USER", "ADMIN"));
router.post(
  "/",
  validate(createSubmissionSchema),
  submissionController.createSubmission,
);
router.get("/", submissionController.getSubmissions);
router.get("/:id/scene", submissionController.getSubmissionScene);
router.put("/:id/scene", submissionController.updateSubmissionScene);
router.get("/:id", submissionController.getSubmissionById);
router.delete("/:id", submissionController.deleteSubmission);
export default router;

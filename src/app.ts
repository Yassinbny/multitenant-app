import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
import submissionRoutes from "./modules/submissions/submission.routes.js";
import tenantRoutes from "./modules/tenants/tenant.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/tenants", tenantRoutes);

app.use("/users", userRoutes);

app.use("/submissions", submissionRoutes);

app.use(errorMiddleware);

export default app;

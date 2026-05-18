import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(2),
});
export const createTenantAdminSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type CreateTenantAdminInput = z.infer<typeof createTenantAdminSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;

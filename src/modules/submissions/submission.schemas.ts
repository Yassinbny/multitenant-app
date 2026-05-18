import { z } from "zod";

export const createSubmissionSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  place: z.string().min(2),
  accidentTime: z.string().min(1),
  licensePlate: z.string().min(5).max(20),
  damageDescription: z.string().min(1).max(255),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import type { CreateSubmissionInput } from "./submission.schemas.js";

type AuthUser = {
  userId: string;
  tenantId: string;
};

export const createSubmission = async (
  input: CreateSubmissionInput,
  authUser: AuthUser,
) => {
  return prisma.formSubmission.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      place: input.place,
      accidentTime: input.accidentTime,
      licensePlate: input.licensePlate,
      damageDescription: input.damageDescription,
      userId: authUser.userId,
      tenantId: authUser.tenantId,
    },
  });
};

export const getSubmissions = async (authUser: AuthUser) => {
  return prisma.formSubmission.findMany({
    where: {
      tenantId: authUser.tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSubmissionById = async (
  submissionId: string,
  authUser: AuthUser,
) => {
  const submission = await prisma.formSubmission.findFirst({
    where: {
      id: submissionId,
      tenantId: authUser.tenantId,
    },
  });

  if (!submission) {
    throw new AppError(404, "Submission not found");
  }

  return submission;
};

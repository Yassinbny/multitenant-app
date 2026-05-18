import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors.js";
import * as submissionService from "./submission.service.js";

const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return {
    userId: req.user.userId,
    tenantId: req.user.tenantId,
  };
};

export const createSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const submission = await submissionService.createSubmission(
      req.body,
      authUser,
    );

    res.status(201).json({
      submission,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const submissions = await submissionService.getSubmissions(authUser);

    res.status(200).json({
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError(400, "Submission id is required");
    }

    const submission = await submissionService.getSubmissionById(id, authUser);

    res.status(200).json({
      submission,
    });
  } catch (error) {
    next(error);
  }
};

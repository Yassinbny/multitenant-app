import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors.js";
import * as tenantService from "./tenant.service.js";

export const createTenant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tenant = await tenantService.createTenant(req.body);

    res.status(201).json({
      tenant,
    });
  } catch (error) {
    next(error);
  }
};

export const getTenants = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tenants = await tenantService.getTenants();

    res.status(200).json({
      tenants,
    });
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError(400, "Tenant id is required");
    }

    const tenant = await tenantService.getTenantById(id);

    res.status(200).json({
      tenant,
    });
  } catch (error) {
    next(error);
  }
};

export const createTenantAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tenantId } = req.params;

    if (typeof tenantId !== "string") {
      throw new AppError(400, "Tenant id is required");
    }

    const admin = await tenantService.createTenantAdmin(tenantId, req.body);

    res.status(201).json({
      admin,
    });
  } catch (error) {
    next(error);
  }
};

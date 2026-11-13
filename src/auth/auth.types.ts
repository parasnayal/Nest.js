import type { Request } from "express";

export interface AuthenticatedUser {
  id: number;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthenticatedUser;
}
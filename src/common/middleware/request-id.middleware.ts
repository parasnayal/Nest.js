import { randomUUID } from "node:crypto";

import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import type {
  Request,
  Response,
  NextFunction,
} from "express";

export interface TracedRequest extends Request {
  requestId?: string;
}

@Injectable()
export class RequestIdMiddleware
  implements NestMiddleware {

  use(
    req: TracedRequest,
    res: Response,
    next: NextFunction
  ): void {
    const requestId = randomUUID();

    req.requestId = requestId;

    res.setHeader("X-Request-Id", requestId);

    next();
  }
}
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    let logged = false;
    
    const log = (outcome: string) => {
      if (logged) return;
      logged = true;

      console.log({
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        outcome,
        durationMs: Math.round(performance.now() - start),
      });
    };
    res.once('finish', () => {
      log('completed');
    });

    res.once('close', () => {
      if (!res.writableFinished) {
        log('aborted');
      }
    });
    next();
  }
}

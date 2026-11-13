// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   Logger,
//   NestInterceptor,
// } from '@nestjs/common';

// import type { Observable } from 'rxjs';
// import { finalize } from 'rxjs';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(LoggingInterceptor.name);

//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const request = context.switchToHttp().getRequest<{
//       method: string;
//       originalUrl: string;
//     }>();

//     const start = performance.now();

//     this.logger.log(`Started ${request.method} ${request.originalUrl}`);

//     return next.handle().pipe(
//       finalize(() => {
//         const durationMs = Math.round(performance.now() - start);

//         this.logger.log(
//           `Finished ${request.method} ` +
//             `${request.originalUrl} in ${durationMs}ms`,
//         );
//       }),
//     );
//   }
// }

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { catchError, finalize, tap, throwError } from 'rxjs';

import type { TracedRequest } from '../middleware/request-id.middleware.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<TracedRequest>();

    const response = context.switchToHttp().getResponse<Response>();

    const start = performance.now();

    let outcome = 'cancelled';

    const label = `${request.method} ${request.originalUrl}`;

    return next.handle().pipe(
      tap({
        complete: () => {
          outcome = 'completed';
        },
      }),

      catchError((error: unknown) => {
        outcome = 'failed';

        this.logger.warn(
          `Handler error: ${label}, ` + `requestId=${request.requestId}`,
        );

        return throwError(() => error);
      }),

      finalize(() => {
        const durationMs = Math.round(performance.now() - start);

        this.logger.log(
          JSON.stringify({
            requestId: request.requestId,
            method: request.method,
            path: request.originalUrl,
            statusCode:
              outcome === 'completed' ? response.statusCode : undefined,
            outcome,
            durationMs,
          }),
        );
      }),
    );
  }
}

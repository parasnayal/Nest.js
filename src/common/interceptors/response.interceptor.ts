import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

interface ApiSuccess<T> {
  success: true;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccess<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccess<T> | T> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // No body should be sent with 204.
        if (response.statusCode === 204) {
          return data;
        }

        return {
          success: true as const,
          data,
        };
      }),
    );
  }
}

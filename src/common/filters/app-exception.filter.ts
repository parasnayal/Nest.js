import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';


@Injectable()
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const details = isHttpException ? exception.getResponse() : null;

    const errorBody =
      typeof details === 'object' && details !== null
        ? (details as Record<string, unknown>)
        : {};

    // 3. Choose a stable error code.
    const code =
      typeof errorBody.code === 'string'
        ? errorBody.code
        : isHttpException
          ? `HTTP_${statusCode}`
          : 'INTERNAL_SERVER_ERROR';

    // 4. Choose a safe message.

    const message = !isHttpException
      ? 'Internal server error'
      : typeof errorBody.message === 'string'
        ? errorBody.message
        : typeof details === 'string'
          ? details
          : 'Request failed';

    // 5. Preserve field validation messages.
    const validationErrors = Array.isArray(errorBody.message)
      ? errorBody.message.filter(
          (value): value is string => typeof value === 'string',
        )
      : undefined;

    // 6. Log unexpected errors on the server.
    if (!isHttpException) {
      this.logger.error(
        'Unexpected request failure',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // 7. Return the consistent error response.
    response.status(statusCode).json({
      success: false,
      error: {
        code,
        message: validationErrors ? 'Validation failed' : message,
        statusCode,
        ...(validationErrors ? { details: validationErrors } : {}),
      },
      path: request.path,
      timestamp: new Date().toISOString(),
    });
  }
}

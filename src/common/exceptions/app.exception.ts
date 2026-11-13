import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(statusCode: number, code: string, message: string) {
    super(
      {
        code,
        message,
      },
      statusCode,
    );
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { AppException } from './common/exceptions/app.exception.js';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory(errors) {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        );

        return new AppException(
          400,
          'VALIDATION_ERROR',
          messages.join('; ') || 'Invalid request data',
        );
      },
    }),
  );
  // const config = app.get(ConfigService);
  const config = app.get(ConfigService<EnvConfig,true>);

  const port = config.get<number>("PORT",{
    infer:true
  });
  
  await app.listen(port);
}
await bootstrap();

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health.controller.js';
import { TasksModule } from './tasks/tasks.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { TasksController } from './tasks/tasks.controller.js';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter } from './common/filters/app-exception.filter.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { validateEnv } from './config/env.validation.js';


@Module({
  // imports: [],
  controllers: [HealthController],
  imports: [TasksModule, AnalyticsModule,ConfigModule.forRoot({
    isGlobal:true,
    validate:validateEnv
  })],
  // providers: [AppService],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware,RequestIdMiddleware).forRoutes(TasksController)
  }
}

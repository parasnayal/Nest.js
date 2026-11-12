import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health.controller.js';
import { TasksModule } from './tasks/tasks.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
  // imports: [],
  controllers: [HealthController],
  imports: [TasksModule,AnalyticsModule],
  // providers: [AppService],
})
export class AppModule {}

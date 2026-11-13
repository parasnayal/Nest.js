import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TaskRepository } from './tasks.repository.js';
import { TASK_REPOSITORY } from './tokens.js';
import { InMemoryTaskRepository } from './in-memory-task.repository.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    JwtAuthGuard,
    // TaskRepository
    {
      provide: TASK_REPOSITORY,
      useClass: InMemoryTaskRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}

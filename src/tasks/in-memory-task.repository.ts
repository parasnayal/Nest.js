import { Injectable } from '@nestjs/common';

import type { Task, TaskRepository } from './task-repository.interface.js';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks: Task[] = [
    { id: 1, title: 'Learn NestJS DI', completed: false },
    { id: 2, title: 'Learn NestJS', completed: false },
  ];
  async findAll(): Promise<Task[]> {
    return this.tasks;
  }
}

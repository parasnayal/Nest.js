import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly tasks = [
    {
      id: 1,
      title: 'Learn NestJS Modules',
      completed: false,
    },
    {
      id: 2,
      title: 'Learn Dependency Injection',
      completed: false,
    },
  ];

  findAll(){
    return this.tasks;
  }
}

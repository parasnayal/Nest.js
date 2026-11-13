import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  private readonly tasks = [
    { id: 1, title: 'Learn NestJS' ,completed:false},
    { id: 2, title: 'Learn DI' , completed:false },
  ];

  findAll() {
    return this.tasks;
  }
}

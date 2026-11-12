import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.type.js';

@Injectable()
export class TasksService {
  //   private readonly tasks = [
  //     {
  //       id: 1,
  //       title: 'Learn NestJS Modules',
  //       completed: false,
  //     },
  //     {
  //       id: 2,
  //       title: 'Learn Dependency Injection',
  //       completed: false,
  //     },
  //   ];
  private tasks: Task[] = [
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

  private nextId = 3;

  //   findAll(){
  //     return this.tasks;
  //   }
  findAll(search?: string): Task[] {
    if (!search) {
      return this.tasks;
    }
    return this.tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      completed: false,
    };
    this.tasks.push(task);

    return task;
  }

  update(id: number, data: Partial<Pick<Task, 'title' | 'completed'>>): Task {
    const task = this.findOne(id);

    if (data.title !== undefined) {
      task.title = data.title;
    }
    if (data.completed !== undefined) {
      task.completed = data.completed;
    }

    return task;
  }
  remove(id: number): void {
    this.findOne(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}

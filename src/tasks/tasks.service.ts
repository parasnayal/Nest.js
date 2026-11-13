import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Task } from './task.type.js';
import { TaskRepository } from './tasks.repository.js';
import { TASK_REPOSITORY } from './tokens.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { AppException } from '../common/exceptions/app.exception.js';

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
  //   private tasks: Task[] = [
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

  private nextId = 3;

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  //   findAll(){
  //     return this.tasks;
  //   }
  findAll(search?: string): Task[] {
    if (!search) {
      console.log(this.taskRepository.findAll());
      return this.taskRepository.findAll();
    }
    return this.taskRepository
      .findAll()
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      );
  }

  async findOne(id: number): Promise<Task> {
    const taskList = await this.taskRepository.findAll();

    const task = taskList.find((item) => item.id === id);

    if (!task) {
      throw new AppException(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    return task;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      completed: dto.completed ?? false,
    };

    return task;
  }

  // update(id: number, data: Partial<Pick<Task, 'title' | 'completed'>>): Task {
  //   const task = this.findOne(id);

  //   if (data.title !== undefined) {
  //     task.title = data.title;
  //   }
  //   if (data.completed !== undefined) {
  //     task.completed = data.completed;
  //   }

  //   return task;
  // }
  // remove(id: number): void {
  //   this.findOne(id);

  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }
}

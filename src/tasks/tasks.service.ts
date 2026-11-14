import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Task } from './task.type.js';
import { TaskRepository } from './tasks.repository.js';
import { TASK_REPOSITORY } from './tokens.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { AppException } from '../common/exceptions/app.exception.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

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
  findAll(search?: string) {
    if (!search) {
      return this.taskRepository.findAll();
    }
    // return this.taskRepository
    //   .findAll()
    //   .filter((task) =>
    //     task.title.toLowerCase().includes(search.toLowerCase()),
    //   );
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppException(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    return task;
  }

  create(dto: CreateTaskDto) {
    return this.taskRepository.create(dto.title);
  }

  async update(id: number, dto: UpdateTaskDto) {
    if (dto.title === undefined && dto.completed === undefined) {
      throw new BadRequestException('At least one field is required');
    }

    const task = await this.taskRepository.update(id, dto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;

    return task;
  }
  async remove(id: number) {
    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Task not found');
    }
  }
}

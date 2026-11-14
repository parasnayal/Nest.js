// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TaskRepository {
//   private readonly tasks = [
//     { id: 1, title: 'Learn NestJS' ,completed:false},
//     { id: 2, title: 'Learn DI' , completed:false },
//   ];

//   findAll() {
//     return this.tasks;
//   }
// }
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Task } from './task.type.js';

@Injectable()
export class TaskRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Task[]> {
    const result = await this.database.query<Task>(
      `SELECT id, title, completed FROM tasks ORDER BY id`,
    );
    return result.rows;
  }

  async findById(id: number): Promise<Task | null> {
    const result = await this.database.query<Task>(
      `SELECT id, title, completed FROM tasks WHERE id=$1`,
      [id],
    );

    return result.rows[0] ?? null;
  }
}

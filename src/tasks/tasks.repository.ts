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
import { UpdateTaskDto } from './dto/update-task.dto.js';

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

  async create(title: string): Promise<Task> {
    const result = await this.database.query<Task>(
      `INSERT INTO tasks(title) VALUES($1) RETURNING id, title, completed, created_at`,
      [title],
    );

    const task = result.rows[0];

    if (!task) {
      throw new Error('Task insertion returned no row');
    }

    return task;
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const result = await this.database.query<Task>(
      `UPDATE tasks SET title=COALESCE($1,title),
      completed=COALESCE($2,completed) 
      WHERE id=$3 
      RETURNING id, title, completed, created_at`,
      [data.title ?? null, data.completed ?? null, id],
    );

    const task = result.rows[0];

    if (!task) {
      throw new Error('Task insertion returned no row');
    }

    return task;
  }

  async delete(id:number): Promise<boolean>{
    const result = await this.database.query(
      `DELETE FROM tasks 
      WHERE id=$1 
      RETURNING id`,
      [id]
    )

    return result.rows.length > 0
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    if (search !== undefined && typeof search !== 'string') {
      throw new BadRequestException('search must be a string');
    }
    return this.taskService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  create(@Body() body: unknown) {
    const data = this.requireObject(body);

    if (typeof data.title !== 'string' || !data.title.trim()) {
      throw new BadRequestException('title must be a non-empty string');
    }

    return this.taskService.create(data.title.trim());
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    const data = this.requireObject(body);

    const { title, completed } = data;
    if (
      (title !== undefined && (typeof title !== 'string' || !title.trim())) ||
      (completed !== undefined && typeof completed !== 'boolean') ||
      (title === undefined && completed === undefined)
    ) {
      throw new BadRequestException('Invalid task update');
    }
    return this.taskService.update(id, {
      ...(typeof title === 'string' ? { title: title.trim() } : {}),
      ...(typeof completed === 'boolean' ? { completed } : {}),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.taskService.remove(id);
  }

  private requireObject(value: unknown): Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new BadRequestException('Request body must be an object');
    }

    return value as Record<string, unknown>;
  }
}

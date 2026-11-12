import { Controller , Get} from '@nestjs/common';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService:TasksService
    ){}

    @Get()
    findAll(){
        return this.taskService.findAll();
    }

}

import {Injectable} from "@nestjs/common";
import { TasksService } from "../tasks/tasks.service.js";

@Injectable()

export class AnalyticService{
    constructor(
        private readonly taskService:TasksService
    ){}

    getTaskCount(){
        return {
            total:20
        }
    }
}
import {Controller,Get} from "@nestjs/common";
import { AnalyticService } from "./analytics.service.js";

@Controller("analytics")
export class AnalyticsController {
    constructor(
        private readonly analyticsService:AnalyticService
    ){}

    @Get("task-count")
    getTaskCount(){
        return this.analyticsService.getTaskCount()
    }
}
import {Module} from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticService } from "./analytics.service.js";
import { TasksModule } from "../tasks/tasks.module.js";

@Module({
    imports:[TasksModule],
    controllers:[AnalyticsController],
    providers:[AnalyticService]
})

export class AnalyticsModule {}
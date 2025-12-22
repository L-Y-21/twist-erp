import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { ProjectTasksService } from "./project-tasks.service"

@ApiTags("Project Tasks")
@ApiBearerAuth()
@Controller("projects/tasks")
@UseGuards(JwtAuthGuard)
export class ProjectTasksController {
  constructor(private readonly tasksService: ProjectTasksService) {}

  @Get()
  findByProject(projectId: string) {
    return this.tasksService.findByProject(projectId)
  }
}

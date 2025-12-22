import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { ProjectResourcesService } from "./project-resources.service"

@ApiTags("Project Resources")
@ApiBearerAuth()
@Controller("projects/resources")
@UseGuards(JwtAuthGuard)
export class ProjectResourcesController {
  constructor(private readonly resourcesService: ProjectResourcesService) {}

  @Get()
  findByProject(projectId: string) {
    return this.resourcesService.findByProject(projectId)
  }
}

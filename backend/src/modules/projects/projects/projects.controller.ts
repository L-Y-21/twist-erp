import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { ProjectsService } from "./projects.service"
import type { CreateProjectDto } from "./dto/create-project.dto"

@ApiTags("Projects")
@ApiBearerAuth()
@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id)
  }

  @Get(":id/dashboard")
  getDashboard(@Param("id") id: string) {
    return this.projectsService.getProjectDashboard(id)
  }

  @Post()
  create(@Body() data: CreateProjectDto) {
    return this.projectsService.create(data)
  }
}

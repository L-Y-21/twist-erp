import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { ProjectsService } from "./projects.service"
import type { CreateProjectDto } from "./dto/create-project.dto"
import type { UpdateProjectDto } from "./dto/update-project.dto"

@ApiTags("Projects")
@ApiBearerAuth()
@Controller("projects")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Permissions("projects:read")
  @ApiOperation({ summary: "Get all projects" })
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(":id")
  @Permissions("projects:read")
  @ApiOperation({ summary: "Get project by ID" })
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id)
  }

  @Get(":id/dashboard")
  @Permissions("projects:read")
  @ApiOperation({ summary: "Get project dashboard" })
  getDashboard(@Param("id") id: string) {
    return this.projectsService.getProjectDashboard(id)
  }

  @Post()
  @Permissions("projects:create")
  @ApiOperation({ summary: "Create project" })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto)
  }

  @Patch(":id")
  @Permissions("projects:update")
  @ApiOperation({ summary: "Update project" })
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto)
  }

  @Delete(":id")
  @Permissions("projects:delete")
  @ApiOperation({ summary: "Delete project" })
  remove(@Param("id") id: string) {
    return this.projectsService.remove(id)
  }
}

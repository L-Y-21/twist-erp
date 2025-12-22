import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { DepartmentsService } from "./departments.service"
import type { CreateDepartmentDto } from "./dto/create-department.dto"
import type { UpdateDepartmentDto } from "./dto/update-department.dto"

@ApiTags("Departments")
@ApiBearerAuth()
@Controller("hr/departments")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @Permissions("departments:read")
  @ApiOperation({ summary: "Get all departments" })
  findAll() {
    return this.departmentsService.findAll()
  }

  @Get(":id")
  @Permissions("departments:read")
  @ApiOperation({ summary: "Get department by ID" })
  findOne(id: string) {
    return this.departmentsService.findOne(id)
  }

  @Post()
  @Permissions("departments:create")
  @ApiOperation({ summary: "Create department" })
  create(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto)
  }

  @Patch(":id")
  @Permissions("departments:update")
  @ApiOperation({ summary: "Update department" })
  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, updateDepartmentDto)
  }

  @Delete(":id")
  @Permissions("departments:delete")
  @ApiOperation({ summary: "Delete department" })
  remove(id: string) {
    return this.departmentsService.remove(id)
  }
}

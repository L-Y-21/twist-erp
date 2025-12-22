import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { EmployeesService } from "./employees.service"
import type { CreateEmployeeDto } from "./dto/create-employee.dto"
import type { UpdateEmployeeDto } from "./dto/update-employee.dto"

@ApiTags("Employees")
@ApiBearerAuth()
@Controller("hr/employees")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Permissions("employees:read")
  @ApiOperation({ summary: "Get all employees" })
  findAll() {
    return this.employeesService.findAll()
  }

  @Get(":id")
  @Permissions("employees:read")
  @ApiOperation({ summary: "Get employee by ID" })
  findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id)
  }

  @Post()
  @Permissions("employees:create")
  @ApiOperation({ summary: "Create employee" })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto)
  }

  @Patch(":id")
  @Permissions("employees:update")
  @ApiOperation({ summary: "Update employee" })
  update(@Param("id") id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto)
  }

  @Delete(":id")
  @Permissions("employees:delete")
  @ApiOperation({ summary: "Delete employee" })
  remove(@Param("id") id: string) {
    return this.employeesService.remove(id)
  }
}

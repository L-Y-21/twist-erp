import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { EmployeesService } from "./employees.service"

@ApiTags("Employees")
@ApiBearerAuth()
@Controller("hr/employees")
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.employeesService.create(data)
  }
}

import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { PayrollService } from "./payroll.service"
import type { CreatePayrollDto } from "./dto/create-payroll.dto"

@ApiTags("Payroll")
@ApiBearerAuth()
@Controller("hr/payroll")
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  findAll() {
    return this.payrollService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollService.findOne(id)
  }

  @Post()
  generate(@Body() data: CreatePayrollDto, @Request() req) {
    return this.payrollService.generatePayroll(data, req.user.id)
  }

  @Patch(":id/approve")
  approve(@Param("id") id: string, @Request() req) {
    return this.payrollService.approve(id, req.user.id)
  }
}

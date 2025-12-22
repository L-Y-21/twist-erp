import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { LeaveService } from "./leave.service"

@ApiTags("Leave")
@ApiBearerAuth()
@Controller("hr/leave")
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  findByEmployee(employeeId: string) {
    return this.leaveService.findByEmployee(employeeId)
  }
}

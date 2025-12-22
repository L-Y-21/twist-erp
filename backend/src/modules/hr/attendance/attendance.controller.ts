import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { AttendanceService } from "./attendance.service"

@ApiTags("Attendance")
@ApiBearerAuth()
@Controller("hr/attendance")
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findByEmployee(employeeId: string, startDate: string, endDate: string) {
    return this.attendanceService.findByEmployee(employeeId, new Date(startDate), new Date(endDate))
  }
}

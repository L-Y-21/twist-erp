import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { VehicleAssignmentsService } from "./vehicle-assignments.service"

@ApiTags("Vehicle Assignments")
@ApiBearerAuth()
@Controller("fleet/assignments")
@UseGuards(JwtAuthGuard)
export class VehicleAssignmentsController {
  constructor(private readonly assignmentsService: VehicleAssignmentsService) {}

  @Get()
  findAll() {
    return this.assignmentsService.findAll()
  }
}

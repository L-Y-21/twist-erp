import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { DesignationsService } from "./designations.service"

@ApiTags("Designations")
@ApiBearerAuth()
@Controller("hr/designations")
@UseGuards(JwtAuthGuard)
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  findAll() {
    return this.designationsService.findAll()
  }
}

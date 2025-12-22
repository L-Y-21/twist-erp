import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { ProgressBillingService } from "./progress-billing.service"

@ApiTags("Progress Billing")
@ApiBearerAuth()
@Controller("projects/billing")
@UseGuards(JwtAuthGuard)
export class ProgressBillingController {
  constructor(private readonly billingService: ProgressBillingService) {}

  @Get()
  findByProject(projectId: string) {
    return this.billingService.findByProject(projectId)
  }
}

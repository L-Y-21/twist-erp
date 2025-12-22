import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { QuotationsService } from "./quotations.service"

@ApiTags("Quotations")
@ApiBearerAuth()
@Controller("sales/quotations")
@UseGuards(JwtAuthGuard)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  findAll() {
    return this.quotationsService.findAll()
  }
}

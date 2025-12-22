import { Controller, Get, Post, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { GRNService } from "./grn.service"
import type { CreateGRNDto } from "./dto/create-grn.dto"

@ApiTags("GRN")
@ApiBearerAuth()
@Controller("procurement/grn")
@UseGuards(JwtAuthGuard)
export class GRNController {
  constructor(private readonly grnService: GRNService) {}

  @Get()
  findAll() {
    return this.grnService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.grnService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateGRNDto, @Request() req: any) {
    return this.grnService.create(data, req.user.id)
  }
}

import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { BOQService } from "./boq.service"
import type { CreateBOQDto } from "./dto/create-boq.dto"

@ApiTags("BOQ")
@ApiBearerAuth()
@Controller("projects/boq")
@UseGuards(JwtAuthGuard)
export class BOQController {
  constructor(private readonly boqService: BOQService) {}

  @Get()
  findAll() {
    return this.boqService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.boqService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateBOQDto, @Request() req: any) {
    return this.boqService.create(data, req.user.id)
  }

  @Patch(":id/approve")
  approve(@Param("id") id: string, @Request() req: any) {
    return this.boqService.approve(id, req.user.id)
  }
}

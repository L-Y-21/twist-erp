import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { VendorsService } from "./vendors.service"

@ApiTags("Vendors")
@ApiBearerAuth()
@Controller("procurement/vendors")
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll() {
    return this.vendorsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vendorsService.findOne(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.vendorsService.create(data)
  }
}

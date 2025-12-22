import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { CustomersService } from "./customers.service"

@ApiTags("Customers")
@ApiBearerAuth()
@Controller("sales/customers")
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll()
  }

  @Get(":id")
  findOne(id: string) {
    return this.customersService.findOne(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.customersService.create(data)
  }
}

import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { SalesOrdersService } from "./sales-orders.service"
import type { CreateSalesOrderDto } from "./dto/create-sales-order.dto"

@ApiTags("Sales Orders")
@ApiBearerAuth()
@Controller("sales/sales-orders")
@UseGuards(JwtAuthGuard)
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get()
  findAll() {
    return this.salesOrdersService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.salesOrdersService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateSalesOrderDto, @Request() req) {
    return this.salesOrdersService.create(data, req.user.id)
  }

  @Patch(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.salesOrdersService.confirm(id)
  }
}

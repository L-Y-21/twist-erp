import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { PurchaseOrdersService } from "./purchase-orders.service"
import type { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto"

@ApiTags("Purchase Orders")
@ApiBearerAuth()
@Controller("procurement/purchase-orders")
@UseGuards(JwtAuthGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.purchaseOrdersService.findOne(id)
  }

  @Post()
  create(@Body() data: CreatePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.create(data, req.user.id)
  }

  @Patch(":id/approve")
  approve(@Param("id") id: string, @Request() req: any) {
    return this.purchaseOrdersService.approve(id, req.user.id)
  }
}

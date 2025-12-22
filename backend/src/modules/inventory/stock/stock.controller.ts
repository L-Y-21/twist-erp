import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { StockService } from "./stock.service"
import type { CreateStockAdjustmentDto } from "./dto/create-stock-adjustment.dto"
import type { CreateStockTransferDto } from "./dto/create-stock-transfer.dto"

@ApiTags("Stock")
@ApiBearerAuth()
@Controller("inventory/stock")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get("levels")
  @Permissions("stock:read")
  @ApiOperation({ summary: "Get stock levels" })
  async getStockLevels(filters: any) {
    return this.stockService.getStockLevels(filters)
  }

  @Get("transactions")
  @Permissions("stock:read")
  @ApiOperation({ summary: "Get stock transactions" })
  async getStockTransactions(filters: any) {
    return this.stockService.getStockTransactions(filters)
  }

  @Post("adjustments")
  @Permissions("stock:adjust")
  @ApiOperation({ summary: "Create stock adjustment" })
  async createStockAdjustment(@Body() dto: CreateStockAdjustmentDto, @Request() req) {
    return this.stockService.createStockAdjustment(dto, req.user.id)
  }

  @Post("transfers")
  @Permissions("stock:transfer")
  @ApiOperation({ summary: "Create stock transfer" })
  async createStockTransfer(@Body() dto: CreateStockTransferDto, @Request() req) {
    return this.stockService.createStockTransfer(dto, req.user.id)
  }

  @Get("items/:itemId/summary")
  @Permissions("stock:read")
  @ApiOperation({ summary: "Get item stock summary" })
  async getItemStockSummary(itemId: string) {
    return this.stockService.getItemStockSummary(itemId)
  }
}

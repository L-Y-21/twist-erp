import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { WarehousesService } from "./warehouses.service"
import type { CreateWarehouseDto } from "./dto/create-warehouse.dto"
import type { UpdateWarehouseDto } from "./dto/update-warehouse.dto"

@ApiTags("Warehouses")
@ApiBearerAuth()
@Controller("inventory/warehouses")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @Permissions("warehouses:read")
  @ApiOperation({ summary: "Get all warehouses" })
  findAll() {
    return this.warehousesService.findAll()
  }

  @Get(":id")
  @Permissions("warehouses:read")
  @ApiOperation({ summary: "Get warehouse by ID" })
  findOne(@Param("id") id: string) {
    return this.warehousesService.findOne(id)
  }

  @Post()
  @Permissions("warehouses:create")
  @ApiOperation({ summary: "Create warehouse" })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto)
  }

  @Patch(":id")
  @Permissions("warehouses:update")
  @ApiOperation({ summary: "Update warehouse" })
  update(@Param("id") id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, updateWarehouseDto)
  }

  @Delete(":id")
  @Permissions("warehouses:delete")
  @ApiOperation({ summary: "Delete warehouse" })
  remove(@Param("id") id: string) {
    return this.warehousesService.remove(id)
  }
}

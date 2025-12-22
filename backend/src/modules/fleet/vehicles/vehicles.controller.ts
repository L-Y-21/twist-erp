import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { VehiclesService } from "./vehicles.service"
import type { CreateVehicleDto } from "./dto/create-vehicle.dto"
import type { UpdateVehicleDto } from "./dto/update-vehicle.dto"

@ApiTags("Vehicles")
@ApiBearerAuth()
@Controller("fleet/vehicles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @Permissions("vehicles:read")
  @ApiOperation({ summary: "Get all vehicles" })
  findAll() {
    return this.vehiclesService.findAll()
  }

  @Get("alerts")
  @Permissions("vehicles:read")
  @ApiOperation({ summary: "Get maintenance alerts" })
  getAlerts() {
    return this.vehiclesService.getMaintenanceAlerts()
  }

  @Get(":id")
  @Permissions("vehicles:read")
  @ApiOperation({ summary: "Get vehicle by ID" })
  findOne(@Param("id") id: string) {
    return this.vehiclesService.findOne(id)
  }

  @Post()
  @Permissions("vehicles:create")
  @ApiOperation({ summary: "Create vehicle" })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto)
  }

  @Patch(":id")
  @Permissions("vehicles:update")
  @ApiOperation({ summary: "Update vehicle" })
  update(@Param("id") id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto)
  }

  @Delete(":id")
  @Permissions("vehicles:delete")
  @ApiOperation({ summary: "Delete vehicle" })
  remove(@Param("id") id: string) {
    return this.vehiclesService.remove(id)
  }
}

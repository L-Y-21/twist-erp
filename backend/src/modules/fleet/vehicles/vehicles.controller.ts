import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { VehiclesService } from "./vehicles.service"
import type { CreateVehicleDto } from "./dto/create-vehicle.dto"

@ApiTags("Vehicles")
@ApiBearerAuth()
@Controller("fleet/vehicles")
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll() {
    return this.vehiclesService.findAll()
  }

  @Get("alerts")
  getAlerts() {
    return this.vehiclesService.getMaintenanceAlerts()
  }

  @Get(":id")
  findOne(id: string) {
    return this.vehiclesService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateVehicleDto) {
    return this.vehiclesService.create(data)
  }
}

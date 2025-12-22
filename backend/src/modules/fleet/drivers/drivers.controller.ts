import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { DriversService } from "./drivers.service"
import type { CreateDriverDto } from "./dto/create-driver.dto"
import type { UpdateDriverDto } from "./dto/update-driver.dto"

@ApiTags("Drivers")
@ApiBearerAuth()
@Controller("fleet/drivers")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @Permissions("drivers:read")
  @ApiOperation({ summary: "Get all drivers" })
  findAll() {
    return this.driversService.findAll()
  }

  @Get(":id")
  @Permissions("drivers:read")
  @ApiOperation({ summary: "Get driver by ID" })
  findOne(id: string) {
    return this.driversService.findOne(id)
  }

  @Post()
  @Permissions("drivers:create")
  @ApiOperation({ summary: "Create driver" })
  create(createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto)
  }

  @Patch(":id")
  @Permissions("drivers:update")
  @ApiOperation({ summary: "Update driver" })
  update(id: string, updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto)
  }

  @Delete(":id")
  @Permissions("drivers:delete")
  @ApiOperation({ summary: "Delete driver" })
  remove(id: string) {
    return this.driversService.remove(id)
  }
}

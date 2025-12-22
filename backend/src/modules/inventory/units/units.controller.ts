import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { UnitsService } from "./units.service"
import type { CreateUnitDto } from "./dto/create-unit.dto"
import type { UpdateUnitDto } from "./dto/update-unit.dto"

@ApiTags("Units")
@ApiBearerAuth()
@Controller("inventory/units")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Permissions("units:read")
  @ApiOperation({ summary: "Get all units" })
  findAll() {
    return this.unitsService.findAll()
  }

  @Get(":id")
  @Permissions("units:read")
  @ApiOperation({ summary: "Get unit by ID" })
  findOne(@Param("id") id: string) {
    return this.unitsService.findOne(id)
  }

  @Post()
  @Permissions("units:create")
  @ApiOperation({ summary: "Create unit" })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto)
  }

  @Patch(":id")
  @Permissions("units:update")
  @ApiOperation({ summary: "Update unit" })
  update(@Param("id") id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto)
  }

  @Delete(":id")
  @Permissions("units:delete")
  @ApiOperation({ summary: "Delete unit" })
  remove(@Param("id") id: string) {
    return this.unitsService.remove(id)
  }
}

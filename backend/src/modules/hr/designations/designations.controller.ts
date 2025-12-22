import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { DesignationsService } from "./designations.service"
import type { CreateDesignationDto } from "./dto/create-designation.dto"
import type { UpdateDesignationDto } from "./dto/update-designation.dto"

@ApiTags("Designations")
@ApiBearerAuth()
@Controller("hr/designations")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  @Permissions("designations:read")
  @ApiOperation({ summary: "Get all designations" })
  findAll() {
    return this.designationsService.findAll()
  }

  @Get(":id")
  @Permissions("designations:read")
  @ApiOperation({ summary: "Get designation by ID" })
  findOne(@Param("id") id: string) {
    return this.designationsService.findOne(id)
  }

  @Post()
  @Permissions("designations:create")
  @ApiOperation({ summary: "Create designation" })
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationsService.create(createDesignationDto)
  }

  @Patch(":id")
  @Permissions("designations:update")
  @ApiOperation({ summary: "Update designation" })
  update(@Param("id") id: string, @Body() updateDesignationDto: UpdateDesignationDto) {
    return this.designationsService.update(id, updateDesignationDto)
  }

  @Delete(":id")
  @Permissions("designations:delete")
  @ApiOperation({ summary: "Delete designation" })
  remove(@Param("id") id: string) {
    return this.designationsService.remove(id)
  }
}

import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { LeadsService } from "./leads.service"
import type { CreateLeadDto } from "./dto/create-lead.dto"
import type { UpdateLeadDto } from "./dto/update-lead.dto"

@ApiTags("Leads")
@ApiBearerAuth()
@Controller("sales/leads")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @Permissions("leads:read")
  @ApiOperation({ summary: "Get all leads" })
  findAll() {
    return this.leadsService.findAll()
  }

  @Get(":id")
  @Permissions("leads:read")
  @ApiOperation({ summary: "Get lead by ID" })
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(id)
  }

  @Post()
  @Permissions("leads:create")
  @ApiOperation({ summary: "Create lead" })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto)
  }

  @Patch(":id")
  @Permissions("leads:update")
  @ApiOperation({ summary: "Update lead" })
  update(@Param("id") id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto)
  }

  @Delete(":id")
  @Permissions("leads:delete")
  @ApiOperation({ summary: "Delete lead" })
  remove(@Param("id") id: string) {
    return this.leadsService.remove(id)
  }
}

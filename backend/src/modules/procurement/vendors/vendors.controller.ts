import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { VendorsService } from "./vendors.service"
import type { CreateVendorDto } from "./dto/create-vendor.dto"
import type { UpdateVendorDto } from "./dto/update-vendor.dto"

@ApiTags("Vendors")
@ApiBearerAuth()
@Controller("procurement/vendors")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @Permissions("vendors:read")
  @ApiOperation({ summary: "Get all vendors" })
  findAll() {
    return this.vendorsService.findAll()
  }

  @Get(":id")
  @Permissions("vendors:read")
  @ApiOperation({ summary: "Get vendor by ID" })
  findOne(@Param("id") id: string) {
    return this.vendorsService.findOne(id)
  }

  @Post()
  @Permissions("vendors:create")
  @ApiOperation({ summary: "Create vendor" })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto)
  }

  @Patch(":id")
  @Permissions("vendors:update")
  @ApiOperation({ summary: "Update vendor" })
  update(@Param("id") id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto)
  }

  @Delete(":id")
  @Permissions("vendors:delete")
  @ApiOperation({ summary: "Delete vendor" })
  remove(@Param("id") id: string) {
    return this.vendorsService.remove(id)
  }
}

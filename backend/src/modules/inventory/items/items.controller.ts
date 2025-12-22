import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { ItemsService } from "./items.service"
import type { CreateItemDto } from "./dto/create-item.dto"
import type { UpdateItemDto } from "./dto/update-item.dto"

@ApiTags("Items")
@ApiBearerAuth()
@Controller("inventory/items")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Permissions("items:create")
  @ApiOperation({ summary: "Create item" })
  create(createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto)
  }

  @Get()
  @Permissions("items:read")
  @ApiOperation({ summary: "Get all items" })
  findAll(filters: any) {
    return this.itemsService.findAll(filters)
  }

  @Get(":id")
  @Permissions("items:read")
  @ApiOperation({ summary: "Get item by ID" })
  findOne(id: string) {
    return this.itemsService.findOne(id)
  }

  @Patch(":id")
  @Permissions("items:update")
  @ApiOperation({ summary: "Update item" })
  update(id: string, updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto)
  }

  @Delete(":id")
  @Permissions("items:delete")
  @ApiOperation({ summary: "Delete item" })
  remove(id: string) {
    return this.itemsService.remove(id)
  }
}

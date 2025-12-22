import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import { PermissionsGuard } from "../../../common/guards/permissions.guard"
import { Permissions } from "../../../common/decorators/permissions.decorator"
import type { CategoriesService } from "./categories.service"
import type { CreateCategoryDto } from "./dto/create-category.dto"
import type { UpdateCategoryDto } from "./dto/update-category.dto"

@ApiTags("Categories")
@ApiBearerAuth()
@Controller("inventory/categories")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Permissions("categories:read")
  @ApiOperation({ summary: "Get all categories" })
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(":id")
  @Permissions("categories:read")
  @ApiOperation({ summary: "Get category by ID" })
  findOne(id: string) {
    return this.categoriesService.findOne(id)
  }

  @Post()
  @Permissions("categories:create")
  @ApiOperation({ summary: "Create category" })
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Patch(":id")
  @Permissions("categories:update")
  @ApiOperation({ summary: "Update category" })
  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(":id")
  @Permissions("categories:delete")
  @ApiOperation({ summary: "Delete category" })
  remove(id: string) {
    return this.categoriesService.remove(id)
  }
}

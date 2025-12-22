import { Controller, Get, Post, Patch, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard"
import type { CategoriesService } from "./categories.service"

@ApiTags("Categories")
@ApiBearerAuth()
@Controller("inventory/categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.categoriesService.create(data)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.categoriesService.update(id, data)
  }
}

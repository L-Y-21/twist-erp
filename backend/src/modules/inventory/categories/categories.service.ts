import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Category } from "./entities/category.entity"
import type { CreateCategoryDto } from "./dto/create-category.dto"
import type { UpdateCategoryDto } from "./dto/update-category.dto"

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: Repository<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ["parent", "children"],
      order: { name: "ASC" },
    })
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["parent", "children", "items"],
    })

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }

    return category
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto)
    return this.categoryRepository.save(category)
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id)
    await this.categoryRepository.update(id, updateCategoryDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.categoryRepository.softDelete(id)
  }
}

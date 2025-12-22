import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Category } from "./entities/category.entity"

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

  async create(data: any): Promise<Category> {
    const category = this.categoryRepository.create(data)
    return this.categoryRepository.save(category)
  }

  async update(id: string, data: any): Promise<Category> {
    await this.findOne(id)
    await this.categoryRepository.update(id, data)
    return this.findOne(id)
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Item } from "./entities/item.entity"
import type { CreateItemDto } from "./dto/create-item.dto"
import type { UpdateItemDto } from "./dto/update-item.dto"

@Injectable()
export class ItemsService {
  constructor(private itemRepository: Repository<Item>) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(createItemDto)
    return this.itemRepository.save(item)
  }

  async findAll(filters?: any): Promise<Item[]> {
    const query = this.itemRepository
      .createQueryBuilder("item")
      .leftJoinAndSelect("item.category", "category")
      .leftJoinAndSelect("item.unit", "unit")

    if (filters?.search) {
      query.andWhere("(item.name ILIKE :search OR item.code ILIKE :search)", {
        search: `%${filters.search}%`,
      })
    }

    if (filters?.categoryId) {
      query.andWhere("item.categoryId = :categoryId", { categoryId: filters.categoryId })
    }

    if (filters?.type) {
      query.andWhere("item.type = :type", { type: filters.type })
    }

    if (filters?.isActive !== undefined) {
      query.andWhere("item.isActive = :isActive", { isActive: filters.isActive })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ["category", "unit", "stockLevels"],
    })

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`)
    }

    return item
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id)
    Object.assign(item, updateItemDto)
    return this.itemRepository.save(item)
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id)
    await this.itemRepository.softDelete(id)
  }
}

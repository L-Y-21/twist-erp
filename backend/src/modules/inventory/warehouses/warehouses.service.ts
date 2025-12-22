import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Warehouse } from "./entities/warehouse.entity"
import type { CreateWarehouseDto } from "./dto/create-warehouse.dto"
import type { UpdateWarehouseDto } from "./dto/update-warehouse.dto"

@Injectable()
export class WarehousesService {
  constructor(private warehouseRepository: Repository<Warehouse>) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      where: { isActive: true },
      relations: ["locations"],
    })
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ["locations"],
    })
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`)
    }
    return warehouse
  }

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(createWarehouseDto)
    return this.warehouseRepository.save(warehouse)
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    await this.findOne(id)
    await this.warehouseRepository.update(id, updateWarehouseDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.warehouseRepository.softDelete(id)
  }
}

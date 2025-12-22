import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Warehouse } from "./entities/warehouse.entity"

@Injectable()
export class WarehousesService {
  constructor(private warehouseRepository: Repository<Warehouse>) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      where: { isActive: true },
      relations: ["locations"],
    })
  }
}

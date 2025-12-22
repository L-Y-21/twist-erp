import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Unit } from "./entities/unit.entity"
import type { CreateUnitDto } from "./dto/create-unit.dto"
import type { UpdateUnitDto } from "./dto/update-unit.dto"

@Injectable()
export class UnitsService {
  constructor(private unitRepository: Repository<Unit>) {}

  async findAll(): Promise<Unit[]> {
    return this.unitRepository.find({ order: { name: "ASC" } })
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } })
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`)
    }
    return unit
  }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create(createUnitDto)
    return this.unitRepository.save(unit)
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    await this.findOne(id)
    await this.unitRepository.update(id, updateUnitDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.unitRepository.softDelete(id)
  }
}

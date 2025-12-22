import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Unit } from "./entities/unit.entity"

@Injectable()
export class UnitsService {
  constructor(private unitRepository: Repository<Unit>) {}

  async findAll(): Promise<Unit[]> {
    return this.unitRepository.find({ order: { name: "ASC" } })
  }
}

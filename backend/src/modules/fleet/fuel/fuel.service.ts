import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { FuelEntry } from "./entities/fuel-entry.entity"

@Injectable()
export class FuelService {
  constructor(private fuelEntryRepository: Repository<FuelEntry>) {}

  async findAll(): Promise<FuelEntry[]> {
    return this.fuelEntryRepository.find({
      relations: ["vehicle"],
      order: { fuelDate: "DESC" },
    })
  }
}

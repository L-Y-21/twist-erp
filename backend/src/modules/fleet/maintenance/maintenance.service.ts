import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { MaintenanceRecord } from "./entities/maintenance-record.entity"

@Injectable()
export class MaintenanceService {
  constructor(private maintenanceRepository: Repository<MaintenanceRecord>) {}

  async findAll(): Promise<MaintenanceRecord[]> {
    return this.maintenanceRepository.find({
      relations: ["vehicle"],
      order: { maintenanceDate: "DESC" },
    })
  }
}

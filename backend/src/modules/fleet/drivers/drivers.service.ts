import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Driver } from "./entities/driver.entity"

@Injectable()
export class DriversService {
  constructor(private driverRepository: Repository<Driver>) {}

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({
      where: { status: "ACTIVE" },
      order: { name: "ASC" },
    })
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Driver } from "./entities/driver.entity"
import type { CreateDriverDto } from "./dto/create-driver.dto"
import type { UpdateDriverDto } from "./dto/update-driver.dto"

@Injectable()
export class DriversService {
  constructor(private driverRepository: Repository<Driver>) {}

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({
      where: { status: "ACTIVE" },
      order: { name: "ASC" },
    })
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id } })
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`)
    }
    return driver
  }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto)
    return this.driverRepository.save(driver)
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    await this.findOne(id)
    await this.driverRepository.update(id, updateDriverDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.driverRepository.update(id, { status: "INACTIVE" })
  }
}

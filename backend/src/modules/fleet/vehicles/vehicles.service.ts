import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Vehicle, VehicleStatus } from "./entities/vehicle.entity"
import type { CreateVehicleDto } from "./dto/create-vehicle.dto"
import type { UpdateVehicleDto } from "./dto/update-vehicle.dto"

@Injectable()
export class VehiclesService {
  constructor(private vehicleRepository: Repository<Vehicle>) {}

  async create(createDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicleNumber = await this.generateVehicleNumber()

    const vehicle = this.vehicleRepository.create({
      ...createDto,
      vehicleNumber,
    })

    return this.vehicleRepository.save(vehicle)
  }

  async findAll(filters?: any): Promise<Vehicle[]> {
    const query = this.vehicleRepository.createQueryBuilder("vehicle").orderBy("vehicle.vehicleNumber", "ASC")

    if (filters?.status) {
      query.andWhere("vehicle.status = :status", { status: filters.status })
    }

    if (filters?.type) {
      query.andWhere("vehicle.type = :type", { type: filters.type })
    }

    if (filters?.isActive !== undefined) {
      query.andWhere("vehicle.isActive = :isActive", { isActive: filters.isActive })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ["fuelEntries", "maintenanceRecords", "assignments"],
    })

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`)
    }

    return vehicle
  }

  async update(id: string, updateDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id)
    Object.assign(vehicle, updateDto)
    return this.vehicleRepository.save(vehicle)
  }

  async updateStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    const vehicle = await this.findOne(id)
    vehicle.status = status
    return this.vehicleRepository.save(vehicle)
  }

  private async generateVehicleNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)

    const lastVehicle = await this.vehicleRepository
      .createQueryBuilder("vehicle")
      .where("vehicle.vehicleNumber LIKE :prefix", { prefix: `VEH${year}%` })
      .orderBy("vehicle.vehicleNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastVehicle) {
      const lastSeq = Number.parseInt(lastVehicle.vehicleNumber.slice(-4))
      sequence = lastSeq + 1
    }

    return `VEH${year}${sequence.toString().padStart(4, "0")}`
  }

  async getMaintenanceAlerts() {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    const vehicles = await this.vehicleRepository
      .createQueryBuilder("vehicle")
      .where("vehicle.isActive = :isActive", { isActive: true })
      .andWhere(
        "(vehicle.insuranceExpiryDate <= :thirtyDays OR vehicle.fitnessExpiryDate <= :thirtyDays OR vehicle.permitExpiryDate <= :thirtyDays OR vehicle.pollutionExpiryDate <= :thirtyDays)",
        { thirtyDays: thirtyDaysFromNow },
      )
      .getMany()

    return vehicles.map((vehicle) => ({
      vehicleId: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      registrationNumber: vehicle.registrationNumber,
      alerts: [
        vehicle.insuranceExpiryDate &&
          vehicle.insuranceExpiryDate <= thirtyDaysFromNow && {
            type: "insurance",
            expiryDate: vehicle.insuranceExpiryDate,
          },
        vehicle.fitnessExpiryDate &&
          vehicle.fitnessExpiryDate <= thirtyDaysFromNow && {
            type: "fitness",
            expiryDate: vehicle.fitnessExpiryDate,
          },
        vehicle.permitExpiryDate &&
          vehicle.permitExpiryDate <= thirtyDaysFromNow && {
            type: "permit",
            expiryDate: vehicle.permitExpiryDate,
          },
        vehicle.pollutionExpiryDate &&
          vehicle.pollutionExpiryDate <= thirtyDaysFromNow && {
            type: "pollution",
            expiryDate: vehicle.pollutionExpiryDate,
          },
      ].filter(Boolean),
    }))
  }
}

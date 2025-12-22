import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Vendor } from "./entities/vendor.entity"
import type { CreateVendorDto } from "./dto/create-vendor.dto"
import type { UpdateVendorDto } from "./dto/update-vendor.dto"

@Injectable()
export class VendorsService {
  private vendorRepository: Repository<Vendor>

  constructor(vendorRepository: Repository<Vendor>) {
    this.vendorRepository = vendorRepository
  }

  async findAll(filters?: any): Promise<Vendor[]> {
    const query = this.vendorRepository.createQueryBuilder("vendor").where("vendor.isActive = :isActive", {
      isActive: true,
    })

    if (filters?.type) {
      query.andWhere("vendor.type = :type", { type: filters.type })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ["purchaseOrders"],
    })

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`)
    }

    return vendor
  }

  async create(data: CreateVendorDto): Promise<Vendor> {
    const code = await this.generateVendorCode()
    const vendor = this.vendorRepository.create({ ...data, code })
    return this.vendorRepository.save(vendor)
  }

  private async generateVendorCode(): Promise<string> {
    const lastVendor = await this.vendorRepository.createQueryBuilder("vendor").orderBy("vendor.code", "DESC").getOne()

    let sequence = 1
    if (lastVendor && lastVendor.code.startsWith("VEN")) {
      const lastSeq = Number.parseInt(lastVendor.code.slice(3))
      sequence = lastSeq + 1
    }

    return `VEN${sequence.toString().padStart(5, "0")}`
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    await this.findOne(id)
    await this.vendorRepository.update(id, updateVendorDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.vendorRepository.softDelete(id)
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Designation } from "./entities/designation.entity"
import type { CreateDesignationDto } from "./dto/create-designation.dto"
import type { UpdateDesignationDto } from "./dto/update-designation.dto"

@Injectable()
export class DesignationsService {
  constructor(private designationRepository: Repository<Designation>) {}

  async findAll(): Promise<Designation[]> {
    return this.designationRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }

  async findOne(id: string): Promise<Designation> {
    const designation = await this.designationRepository.findOne({ where: { id } })
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`)
    }
    return designation
  }

  async create(createDesignationDto: CreateDesignationDto): Promise<Designation> {
    const designation = this.designationRepository.create(createDesignationDto)
    return this.designationRepository.save(designation)
  }

  async update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation> {
    await this.findOne(id)
    await this.designationRepository.update(id, updateDesignationDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.designationRepository.softDelete(id)
  }
}

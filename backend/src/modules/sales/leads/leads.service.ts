import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Lead } from "./entities/lead.entity"
import type { CreateLeadDto } from "./dto/create-lead.dto"
import type { UpdateLeadDto } from "./dto/update-lead.dto"

@Injectable()
export class LeadsService {
  constructor(private leadRepository: Repository<Lead>) {}

  async findAll(): Promise<Lead[]> {
    return this.leadRepository.find({ order: { createdAt: "DESC" } })
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } })
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`)
    }
    return lead
  }

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto)
    return this.leadRepository.save(lead)
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    await this.findOne(id)
    await this.leadRepository.update(id, updateLeadDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.leadRepository.softDelete(id)
  }
}

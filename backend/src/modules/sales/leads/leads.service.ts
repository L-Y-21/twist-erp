import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Lead } from "./entities/lead.entity"

@Injectable()
export class LeadsService {
  constructor(private leadRepository: Repository<Lead>) {}

  async findAll(): Promise<Lead[]> {
    return this.leadRepository.find({ order: { createdAt: "DESC" } })
  }
}

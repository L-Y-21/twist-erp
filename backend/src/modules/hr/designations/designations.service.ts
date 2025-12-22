import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Designation } from "./entities/designation.entity"

@Injectable()
export class DesignationsService {
  constructor(private designationRepository: Repository<Designation>) {}

  async findAll(): Promise<Designation[]> {
    return this.designationRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }
}

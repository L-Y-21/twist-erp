import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Quotation } from "./entities/quotation.entity"

@Injectable()
export class QuotationsService {
  constructor(private quotationRepository: Repository<Quotation>) {}

  async findAll(): Promise<Quotation[]> {
    return this.quotationRepository.find({
      relations: ["customer", "items"],
      order: { quotationDate: "DESC" },
    })
  }
}

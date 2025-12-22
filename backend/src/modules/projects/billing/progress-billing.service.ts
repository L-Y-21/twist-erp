import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ProgressBilling } from "./entities/progress-billing.entity"

@Injectable()
export class ProgressBillingService {
  constructor(private billingRepository: Repository<ProgressBilling>) {}

  async findByProject(projectId: string): Promise<ProgressBilling[]> {
    return this.billingRepository.find({
      where: { projectId },
      relations: ["items"],
      order: { billingDate: "DESC" },
    })
  }
}

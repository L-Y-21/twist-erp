import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Leave } from "./entities/leave.entity"

@Injectable()
export class LeaveService {
  constructor(private leaveRepository: Repository<Leave>) {}

  async findByEmployee(employeeId: string): Promise<Leave[]> {
    return this.leaveRepository.find({
      where: { employeeId },
      order: { fromDate: "DESC" },
    })
  }
}

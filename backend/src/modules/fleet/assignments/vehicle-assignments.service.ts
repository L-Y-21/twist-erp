import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { VehicleAssignment } from "./entities/vehicle-assignment.entity"

@Injectable()
export class VehicleAssignmentsService {
  constructor(private assignmentRepository: Repository<VehicleAssignment>) {}

  async findAll(): Promise<VehicleAssignment[]> {
    return this.assignmentRepository.find({
      relations: ["vehicle", "driver"],
      order: { startDate: "DESC" },
    })
  }
}

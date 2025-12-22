import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Department } from "./entities/department.entity"

@Injectable()
export class DepartmentsService {
  constructor(private departmentRepository: Repository<Department>) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }
}

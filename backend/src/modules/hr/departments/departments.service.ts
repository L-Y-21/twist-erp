import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Department } from "./entities/department.entity"
import type { CreateDepartmentDto } from "./dto/create-department.dto"
import type { UpdateDepartmentDto } from "./dto/update-department.dto"

@Injectable()
export class DepartmentsService {
  constructor(private departmentRepository: Repository<Department>) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } })
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`)
    }
    return department
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto)
    return this.departmentRepository.save(department)
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    await this.findOne(id)
    await this.departmentRepository.update(id, updateDepartmentDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.departmentRepository.softDelete(id)
  }
}

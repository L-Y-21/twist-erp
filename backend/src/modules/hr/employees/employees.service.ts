import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Employee } from "./entities/employee.entity"

@Injectable()
export class EmployeesService {
  constructor(private employeeRepository: Repository<Employee>) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { status: "ACTIVE" },
      order: { firstName: "ASC" },
    })
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ["reportingManager", "attendances", "leaves"],
    })

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`)
    }

    return employee
  }

  async create(data: any): Promise<Employee> {
    const code = await this.generateEmployeeCode()
    const employee = this.employeeRepository.create({ ...data, employeeCode: code })
    return this.employeeRepository.save(employee)
  }

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeeRepository
      .createQueryBuilder("employee")
      .orderBy("employee.employeeCode", "DESC")
      .getOne()

    let sequence = 1
    if (lastEmployee && lastEmployee.employeeCode.startsWith("EMP")) {
      const lastSeq = Number.parseInt(lastEmployee.employeeCode.slice(3))
      sequence = lastSeq + 1
    }

    return `EMP${sequence.toString().padStart(5, "0")}`
  }
}

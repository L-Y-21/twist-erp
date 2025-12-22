import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Customer } from "./entities/customer.entity"

@Injectable()
export class CustomersService {
  constructor(private customerRepository: Repository<Customer>) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ["salesOrders", "quotations"],
    })

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }

    return customer
  }

  async create(data: any): Promise<Customer> {
    const code = await this.generateCustomerCode()
    const customer = this.customerRepository.create({ ...data, code })
    return this.customerRepository.save(customer)
  }

  private async generateCustomerCode(): Promise<string> {
    const lastCustomer = await this.customerRepository
      .createQueryBuilder("customer")
      .orderBy("customer.code", "DESC")
      .getOne()

    let sequence = 1
    if (lastCustomer && lastCustomer.code.startsWith("CUS")) {
      const lastSeq = Number.parseInt(lastCustomer.code.slice(3))
      sequence = lastSeq + 1
    }

    return `CUS${sequence.toString().padStart(5, "0")}`
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Customer } from "./entities/customer.entity"
import type { CreateCustomerDto } from "./dto/create-customer.dto"
import type { UpdateCustomerDto } from "./dto/update-customer.dto"

@Injectable()
export class CustomersService {
  private customerRepository: Repository<Customer>

  constructor(customerRepository: Repository<Customer>) {
    this.customerRepository = customerRepository
  }

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

  async create(data: CreateCustomerDto): Promise<Customer> {
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

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.findOne(id)
    await this.customerRepository.update(id, updateCustomerDto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.customerRepository.softDelete(id)
  }
}

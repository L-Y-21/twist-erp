import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { Invoice, InvoiceStatus } from "./entities/invoice.entity"
import { InvoiceItem } from "./entities/invoice-item.entity"
import type { Customer } from "../customers/entities/customer.entity"
import type { CreateInvoiceDto } from "./dto/create-invoice.dto"

@Injectable()
export class InvoicesService {
  constructor(
    private invoiceRepository: Repository<Invoice>,
    private invoiceItemRepository: Repository<InvoiceItem>,
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateInvoiceDto, userId: string): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const invoiceNumber = await this.generateInvoiceNumber()

      // Calculate totals
      let subtotal = 0
      const itemsData = createDto.items.map((item) => {
        const itemTotal = Number(item.quantity) * Number(item.unitPrice)
        const taxAmount = (itemTotal * Number(item.taxRate)) / 100
        subtotal += itemTotal
        return {
          ...item,
          taxAmount,
          totalAmount: itemTotal + taxAmount,
        }
      })

      const taxAmount = itemsData.reduce((sum, item) => sum + Number(item.taxAmount), 0)
      const totalAmount = subtotal + taxAmount - Number(createDto.discount || 0)

      const invoice = queryRunner.manager.create(Invoice, {
        invoiceNumber,
        invoiceDate: createDto.invoiceDate,
        dueDate: createDto.dueDate,
        customerId: createDto.customerId,
        salesOrderId: createDto.salesOrderId,
        projectId: createDto.projectId,
        billingAddress: createDto.billingAddress,
        terms: createDto.terms,
        notes: createDto.notes,
        subtotal,
        taxAmount,
        discount: createDto.discount || 0,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        createdBy: userId,
        status: InvoiceStatus.DRAFT,
      })

      await queryRunner.manager.save(invoice)

      // Create items
      for (const itemData of itemsData) {
        const item = queryRunner.manager.create(InvoiceItem, {
          invoiceId: invoice.id,
          itemId: itemData.itemId,
          description: itemData.description,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          taxRate: itemData.taxRate,
          taxAmount: itemData.taxAmount,
          totalAmount: itemData.totalAmount,
          hsnCode: itemData.hsnCode,
        })
        await queryRunner.manager.save(item)
      }

      // Update customer outstanding balance
      const customer = await this.customerRepository.findOne({
        where: { id: createDto.customerId },
      })
      if (customer) {
        customer.outstandingBalance = Number(customer.outstandingBalance) + Number(totalAmount)
        await queryRunner.manager.save(customer)
      }

      await queryRunner.commitTransaction()

      return this.findOne(invoice.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<Invoice[]> {
    const query = this.invoiceRepository
      .createQueryBuilder("inv")
      .leftJoinAndSelect("inv.customer", "customer")
      .leftJoinAndSelect("inv.items", "items")
      .leftJoinAndSelect("items.item", "item")
      .orderBy("inv.invoiceDate", "DESC")

    if (filters?.customerId) {
      query.andWhere("inv.customerId = :customerId", { customerId: filters.customerId })
    }

    if (filters?.status) {
      query.andWhere("inv.status = :status", { status: filters.status })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ["customer", "items", "items.item", "payments"],
    })

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`)
    }

    return invoice
  }

  async recordPayment(invoiceId: string, amount: number, userId: string): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const invoice = await this.findOne(invoiceId)

      if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
        throw new BadRequestException("Cannot record payment for this invoice")
      }

      const newPaidAmount = Number(invoice.paidAmount) + Number(amount)
      const newBalanceAmount = Number(invoice.totalAmount) - newPaidAmount

      invoice.paidAmount = newPaidAmount
      invoice.balanceAmount = newBalanceAmount

      if (newBalanceAmount <= 0) {
        invoice.status = InvoiceStatus.PAID
      } else if (newPaidAmount > 0) {
        invoice.status = InvoiceStatus.PARTIALLY_PAID
      }

      await queryRunner.manager.save(invoice)

      // Update customer outstanding balance
      const customer = await this.customerRepository.findOne({
        where: { id: invoice.customerId },
      })
      if (customer) {
        customer.outstandingBalance = Number(customer.outstandingBalance) - Number(amount)
        await queryRunner.manager.save(customer)
      }

      await queryRunner.commitTransaction()

      return this.findOne(invoiceId)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastInvoice = await this.invoiceRepository
      .createQueryBuilder("inv")
      .where("inv.invoiceNumber LIKE :prefix", { prefix: `INV${year}${month}%` })
      .orderBy("inv.invoiceNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastInvoice) {
      const lastSeq = Number.parseInt(lastInvoice.invoiceNumber.slice(-6))
      sequence = lastSeq + 1
    }

    return `INV${year}${month}${sequence.toString().padStart(6, "0")}`
  }
}

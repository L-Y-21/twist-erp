import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { SalesOrder, SalesOrderStatus } from "./entities/sales-order.entity"
import { SalesOrderItem } from "./entities/sales-order-item.entity"
import type { CreateSalesOrderDto } from "./dto/create-sales-order.dto"
import type { UpdateSalesOrderDto } from "./dto/update-sales-order.dto"

@Injectable()
export class SalesOrdersService {
  constructor(
    private salesOrderRepository: Repository<SalesOrder>,
    private salesOrderItemRepository: Repository<SalesOrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateSalesOrderDto, userId: string): Promise<SalesOrder> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const orderNumber = await this.generateOrderNumber()

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

      const salesOrder = queryRunner.manager.create(SalesOrder, {
        orderNumber,
        orderDate: createDto.orderDate,
        deliveryDate: createDto.deliveryDate,
        customerId: createDto.customerId,
        quotationId: createDto.quotationId,
        projectId: createDto.projectId,
        customerPONumber: createDto.customerPONumber,
        customerPODate: createDto.customerPODate,
        billingAddress: createDto.billingAddress,
        shippingAddress: createDto.shippingAddress,
        terms: createDto.terms,
        notes: createDto.notes,
        subtotal,
        taxAmount,
        discount: createDto.discount || 0,
        totalAmount,
        createdBy: userId,
        status: SalesOrderStatus.DRAFT,
      })

      await queryRunner.manager.save(salesOrder)

      // Create items
      for (const itemData of itemsData) {
        const item = queryRunner.manager.create(SalesOrderItem, {
          salesOrderId: salesOrder.id,
          itemId: itemData.itemId,
          description: itemData.description,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          taxRate: itemData.taxRate,
          taxAmount: itemData.taxAmount,
          totalAmount: itemData.totalAmount,
          warehouseId: itemData.warehouseId,
          specifications: itemData.specifications,
        })
        await queryRunner.manager.save(item)
      }

      await queryRunner.commitTransaction()

      return this.findOne(salesOrder.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<SalesOrder[]> {
    const query = this.salesOrderRepository
      .createQueryBuilder("so")
      .leftJoinAndSelect("so.customer", "customer")
      .leftJoinAndSelect("so.items", "items")
      .leftJoinAndSelect("items.item", "item")
      .orderBy("so.orderDate", "DESC")

    if (filters?.customerId) {
      query.andWhere("so.customerId = :customerId", { customerId: filters.customerId })
    }

    if (filters?.status) {
      query.andWhere("so.status = :status", { status: filters.status })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<SalesOrder> {
    const order = await this.salesOrderRepository.findOne({
      where: { id },
      relations: ["customer", "items", "items.item", "invoices"],
    })

    if (!order) {
      throw new NotFoundException(`Sales Order with ID ${id} not found`)
    }

    return order
  }

  async update(id: string, updateDto: UpdateSalesOrderDto): Promise<SalesOrder> {
    const order = await this.findOne(id)

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException("Only draft orders can be updated")
    }

    Object.assign(order, updateDto)
    await this.salesOrderRepository.save(order)

    return this.findOne(id)
  }

  async confirm(id: string): Promise<SalesOrder> {
    const order = await this.findOne(id)

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException("Only draft orders can be confirmed")
    }

    order.status = SalesOrderStatus.CONFIRMED
    await this.salesOrderRepository.save(order)

    return this.findOne(id)
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastOrder = await this.salesOrderRepository
      .createQueryBuilder("so")
      .where("so.orderNumber LIKE :prefix", { prefix: `SO${year}${month}%` })
      .orderBy("so.orderNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastOrder) {
      const lastSeq = Number.parseInt(lastOrder.orderNumber.slice(-6))
      sequence = lastSeq + 1
    }

    return `SO${year}${month}${sequence.toString().padStart(6, "0")}`
  }
}

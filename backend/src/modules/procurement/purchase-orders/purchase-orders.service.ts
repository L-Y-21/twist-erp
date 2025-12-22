import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { PurchaseOrder, PurchaseOrderStatus } from "./entities/purchase-order.entity"
import { PurchaseOrderItem } from "./entities/purchase-order-item.entity"
import type { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto"
import type { UpdatePurchaseOrderDto } from "./dto/update-purchase-order.dto"

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreatePurchaseOrderDto, userId: string): Promise<PurchaseOrder> {
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
      const totalAmount = subtotal + taxAmount + Number(createDto.otherCharges || 0) - Number(createDto.discount || 0)

      const purchaseOrder = queryRunner.manager.create(PurchaseOrder, {
        orderNumber,
        orderDate: createDto.orderDate,
        expectedDeliveryDate: createDto.expectedDeliveryDate,
        vendorId: createDto.vendorId,
        vendorQuotationRef: createDto.vendorQuotationRef,
        requisitionId: createDto.requisitionId,
        projectId: createDto.projectId,
        deliveryWarehouseId: createDto.deliveryWarehouseId,
        deliveryAddress: createDto.deliveryAddress,
        billingAddress: createDto.billingAddress,
        terms: createDto.terms,
        remarks: createDto.remarks,
        subtotal,
        taxAmount,
        otherCharges: createDto.otherCharges || 0,
        discount: createDto.discount || 0,
        totalAmount,
        createdBy: userId,
        status: PurchaseOrderStatus.DRAFT,
      })

      await queryRunner.manager.save(purchaseOrder)

      // Create items
      for (const itemData of itemsData) {
        const item = queryRunner.manager.create(PurchaseOrderItem, {
          purchaseOrderId: purchaseOrder.id,
          itemId: itemData.itemId,
          description: itemData.description,
          orderedQuantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          taxRate: itemData.taxRate,
          taxAmount: itemData.taxAmount,
          totalAmount: itemData.totalAmount,
          hsnCode: itemData.hsnCode,
          specifications: itemData.specifications,
          remarks: itemData.remarks,
        })
        await queryRunner.manager.save(item)
      }

      await queryRunner.commitTransaction()

      return this.findOne(purchaseOrder.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<PurchaseOrder[]> {
    const query = this.purchaseOrderRepository
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.vendor", "vendor")
      .leftJoinAndSelect("po.items", "items")
      .leftJoinAndSelect("items.item", "item")
      .orderBy("po.orderDate", "DESC")

    if (filters?.vendorId) {
      query.andWhere("po.vendorId = :vendorId", { vendorId: filters.vendorId })
    }

    if (filters?.status) {
      query.andWhere("po.status = :status", { status: filters.status })
    }

    if (filters?.startDate) {
      query.andWhere("po.orderDate >= :startDate", { startDate: filters.startDate })
    }

    if (filters?.endDate) {
      query.andWhere("po.orderDate <= :endDate", { endDate: filters.endDate })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ["vendor", "items", "items.item", "grns"],
    })

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`)
    }

    return po
  }

  async update(id: string, updateDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const po = await this.findOne(id)

    if (po.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException("Only draft purchase orders can be updated")
    }

    Object.assign(po, updateDto)
    await this.purchaseOrderRepository.save(po)

    return this.findOne(id)
  }

  async approve(id: string, userId: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id)

    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL && po.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException("Purchase order cannot be approved")
    }

    po.status = PurchaseOrderStatus.APPROVED
    po.approvedBy = userId
    po.approvedDate = new Date()

    await this.purchaseOrderRepository.save(po)

    return this.findOne(id)
  }

  async cancel(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id)

    if (po.status === PurchaseOrderStatus.RECEIVED || po.status === PurchaseOrderStatus.CLOSED) {
      throw new BadRequestException("Cannot cancel a completed purchase order")
    }

    po.status = PurchaseOrderStatus.CANCELLED
    await this.purchaseOrderRepository.save(po)

    return this.findOne(id)
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastPO = await this.purchaseOrderRepository
      .createQueryBuilder("po")
      .where("po.orderNumber LIKE :prefix", { prefix: `PO${year}${month}%` })
      .orderBy("po.orderNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastPO) {
      const lastSeq = Number.parseInt(lastPO.orderNumber.slice(-6))
      sequence = lastSeq + 1
    }

    return `PO${year}${month}${sequence.toString().padStart(6, "0")}`
  }
}

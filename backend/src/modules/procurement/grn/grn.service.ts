import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { GoodsReceivedNote, GRNStatus } from "./entities/goods-received-note.entity"
import { GoodsReceivedNoteItem, InspectionStatus } from "./entities/goods-received-note-item.entity"
import { type PurchaseOrder, PurchaseOrderStatus } from "../purchase-orders/entities/purchase-order.entity"
import type { PurchaseOrderItem } from "../purchase-orders/entities/purchase-order-item.entity"
import { TransactionReason } from "../../inventory/stock/entities/stock-transaction.entity"
import type { CreateGRNDto } from "./dto/create-grn.dto"
import type { StockService } from "../../inventory/stock/stock.service"

@Injectable()
export class GRNService {
  constructor(
    private grnRepository: Repository<GoodsReceivedNote>,
    private grnItemRepository: Repository<GoodsReceivedNoteItem>,
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    private stockService: StockService,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateGRNDto, userId: string): Promise<GoodsReceivedNote> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id: createDto.purchaseOrderId },
        relations: ["items", "items.item"],
      })

      if (!purchaseOrder) {
        throw new NotFoundException("Purchase order not found")
      }

      if (purchaseOrder.status !== PurchaseOrderStatus.APPROVED && purchaseOrder.status !== PurchaseOrderStatus.SENT) {
        throw new BadRequestException("Purchase order is not in a valid state for receiving goods")
      }

      const grnNumber = await this.generateGRNNumber()

      const grn = queryRunner.manager.create(GoodsReceivedNote, {
        grnNumber,
        receivedDate: createDto.receivedDate,
        purchaseOrderId: createDto.purchaseOrderId,
        warehouseId: createDto.warehouseId,
        vehicleNumber: createDto.vehicleNumber,
        driverName: createDto.driverName,
        driverPhone: createDto.driverPhone,
        invoiceNumber: createDto.invoiceNumber,
        invoiceDate: createDto.invoiceDate,
        invoiceAmount: createDto.invoiceAmount,
        challanNumber: createDto.challanNumber,
        challanDate: createDto.challanDate,
        remarks: createDto.remarks,
        receivedBy: userId,
        status: GRNStatus.RECEIVED,
      })

      await queryRunner.manager.save(grn)

      // Create GRN items and update stock
      for (const itemDto of createDto.items) {
        const poItem = purchaseOrder.items.find((i) => i.id === itemDto.purchaseOrderItemId)
        if (!poItem) {
          throw new NotFoundException(`Purchase order item ${itemDto.purchaseOrderItemId} not found`)
        }

        const grnItem = queryRunner.manager.create(GoodsReceivedNoteItem, {
          grnId: grn.id,
          purchaseOrderItemId: itemDto.purchaseOrderItemId,
          itemId: poItem.itemId,
          orderedQuantity: poItem.orderedQuantity,
          receivedQuantity: itemDto.receivedQuantity,
          acceptedQuantity: itemDto.acceptedQuantity || itemDto.receivedQuantity,
          rejectedQuantity: itemDto.rejectedQuantity || 0,
          inspectionStatus: itemDto.acceptedQuantity ? InspectionStatus.ACCEPTED : InspectionStatus.PENDING,
          batchNumber: itemDto.batchNumber,
          serialNumber: itemDto.serialNumber,
          manufacturingDate: itemDto.manufacturingDate,
          expiryDate: itemDto.expiryDate,
          locationId: itemDto.locationId,
          unitPrice: poItem.unitPrice,
          rejectionReason: itemDto.rejectionReason,
          remarks: itemDto.remarks,
        })

        await queryRunner.manager.save(grnItem)

        // Update PO item received quantity
        poItem.receivedQuantity = Number(poItem.receivedQuantity) + Number(itemDto.receivedQuantity)
        poItem.acceptedQuantity = Number(poItem.acceptedQuantity) + Number(itemDto.acceptedQuantity || 0)
        poItem.rejectedQuantity = Number(poItem.rejectedQuantity) + Number(itemDto.rejectedQuantity || 0)
        await queryRunner.manager.save(poItem)

        // Update stock if accepted
        if (itemDto.acceptedQuantity && itemDto.acceptedQuantity > 0) {
          await this.stockService.createStockAdjustment(
            {
              adjustmentDate: createDto.receivedDate.toISOString(),
              reason: TransactionReason.PURCHASE,
              items: [
                {
                  itemId: poItem.itemId,
                  warehouseId: createDto.warehouseId,
                  locationId: itemDto.locationId,
                  batchNumber: itemDto.batchNumber,
                  serialNumber: itemDto.serialNumber,
                  quantity: itemDto.acceptedQuantity,
                  unitCost: Number(poItem.unitPrice),
                  remarks: `GRN ${grnNumber}`,
                },
              ],
            },
            userId,
          )
        }
      }

      // Update PO status
      const allItemsReceived = purchaseOrder.items.every(
        (item) => Number(item.receivedQuantity) >= Number(item.orderedQuantity),
      )
      const anyItemReceived = purchaseOrder.items.some((item) => Number(item.receivedQuantity) > 0)

      if (allItemsReceived) {
        purchaseOrder.status = PurchaseOrderStatus.RECEIVED
      } else if (anyItemReceived) {
        purchaseOrder.status = PurchaseOrderStatus.PARTIALLY_RECEIVED
      }

      await queryRunner.manager.save(purchaseOrder)

      await queryRunner.commitTransaction()

      return this.findOne(grn.id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(filters?: any): Promise<GoodsReceivedNote[]> {
    const query = this.grnRepository
      .createQueryBuilder("grn")
      .leftJoinAndSelect("grn.purchaseOrder", "po")
      .leftJoinAndSelect("po.vendor", "vendor")
      .leftJoinAndSelect("grn.items", "items")
      .leftJoinAndSelect("items.item", "item")
      .orderBy("grn.receivedDate", "DESC")

    if (filters?.purchaseOrderId) {
      query.andWhere("grn.purchaseOrderId = :purchaseOrderId", {
        purchaseOrderId: filters.purchaseOrderId,
      })
    }

    if (filters?.status) {
      query.andWhere("grn.status = :status", { status: filters.status })
    }

    return query.getMany()
  }

  async findOne(id: string): Promise<GoodsReceivedNote> {
    const grn = await this.grnRepository.findOne({
      where: { id },
      relations: ["purchaseOrder", "purchaseOrder.vendor", "items", "items.item"],
    })

    if (!grn) {
      throw new NotFoundException(`GRN with ID ${id} not found`)
    }

    return grn
  }

  private async generateGRNNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastGRN = await this.grnRepository
      .createQueryBuilder("grn")
      .where("grn.grnNumber LIKE :prefix", { prefix: `GRN${year}${month}%` })
      .orderBy("grn.grnNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastGRN) {
      const lastSeq = Number.parseInt(lastGRN.grnNumber.slice(-6))
      sequence = lastSeq + 1
    }

    return `GRN${year}${month}${sequence.toString().padStart(6, "0")}`
  }
}

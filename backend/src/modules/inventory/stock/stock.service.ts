import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { StockLevel } from "./entities/stock-level.entity"
import { StockTransaction, TransactionType, TransactionReason } from "./entities/stock-transaction.entity"
import { type Item, ValuationMethod } from "../items/entities/item.entity"
import type { CreateStockAdjustmentDto } from "./dto/create-stock-adjustment.dto"
import type { CreateStockTransferDto } from "./dto/create-stock-transfer.dto"

@Injectable()
export class StockService {
  constructor(
    private stockLevelRepository: Repository<StockLevel>,
    private stockTransactionRepository: Repository<StockTransaction>,
    private itemRepository: Repository<Item>,
    private dataSource: DataSource,
  ) {}

  async getStockLevels(filters?: any) {
    const query = this.stockLevelRepository
      .createQueryBuilder("stock")
      .leftJoinAndSelect("stock.item", "item")
      .leftJoinAndSelect("stock.warehouse", "warehouse")
      .leftJoinAndSelect("stock.location", "location")
      .where("stock.quantity > 0")

    if (filters?.itemId) {
      query.andWhere("stock.itemId = :itemId", { itemId: filters.itemId })
    }

    if (filters?.warehouseId) {
      query.andWhere("stock.warehouseId = :warehouseId", { warehouseId: filters.warehouseId })
    }

    if (filters?.categoryId) {
      query.andWhere("item.categoryId = :categoryId", { categoryId: filters.categoryId })
    }

    return query.getMany()
  }

  async getStockTransactions(filters?: any) {
    const query = this.stockTransactionRepository
      .createQueryBuilder("txn")
      .leftJoinAndSelect("txn.item", "item")
      .leftJoinAndSelect("txn.warehouse", "warehouse")
      .leftJoinAndSelect("txn.location", "location")
      .orderBy("txn.transactionDate", "DESC")

    if (filters?.itemId) {
      query.andWhere("txn.itemId = :itemId", { itemId: filters.itemId })
    }

    if (filters?.warehouseId) {
      query.andWhere("txn.warehouseId = :warehouseId", { warehouseId: filters.warehouseId })
    }

    if (filters?.startDate) {
      query.andWhere("txn.transactionDate >= :startDate", { startDate: filters.startDate })
    }

    if (filters?.endDate) {
      query.andWhere("txn.transactionDate <= :endDate", { endDate: filters.endDate })
    }

    return query.getMany()
  }

  async createStockAdjustment(dto: CreateStockAdjustmentDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const transactionNumber = await this.generateTransactionNumber("ADJ")
      const transactions: StockTransaction[] = []

      for (const item of dto.items) {
        const stockItem = await this.itemRepository.findOne({ where: { id: item.itemId } })
        if (!stockItem) {
          throw new NotFoundException(`Item ${item.itemId} not found`)
        }

        // Create transaction
        const transaction = queryRunner.manager.create(StockTransaction, {
          transactionNumber,
          transactionDate: new Date(dto.adjustmentDate),
          transactionType: item.quantity > 0 ? TransactionType.RECEIPT : TransactionType.ISSUE,
          reason: dto.reason,
          itemId: item.itemId,
          warehouseId: item.warehouseId,
          locationId: item.locationId,
          batchNumber: item.batchNumber,
          serialNumber: item.serialNumber,
          quantity: Math.abs(item.quantity),
          unitCost: item.unitCost,
          totalValue: Math.abs(item.quantity) * item.unitCost,
          remarks: item.remarks || dto.remarks,
          createdBy: userId,
        })

        await queryRunner.manager.save(transaction)
        transactions.push(transaction)

        // Update stock level
        await this.updateStockLevel(
          queryRunner,
          item.itemId,
          item.warehouseId,
          item.locationId,
          item.batchNumber,
          item.serialNumber,
          item.quantity,
          item.unitCost,
          stockItem.valuationMethod,
        )
      }

      await queryRunner.commitTransaction()
      return transactions
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async createStockTransfer(dto: CreateStockTransferDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const transactionNumber = await this.generateTransactionNumber("TRF")
      const transactions: StockTransaction[] = []

      for (const item of dto.items) {
        const stockItem = await this.itemRepository.findOne({ where: { id: item.itemId } })
        if (!stockItem) {
          throw new NotFoundException(`Item ${item.itemId} not found`)
        }

        // Check if stock is available
        const stockLevel = await this.getStockLevelRecord(
          queryRunner,
          item.itemId,
          dto.fromWarehouseId,
          dto.fromLocationId,
          item.batchNumber,
          item.serialNumber,
        )

        if (!stockLevel || stockLevel.availableQuantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for item ${stockItem.name}`)
        }

        // Issue from source
        const issueTransaction = queryRunner.manager.create(StockTransaction, {
          transactionNumber,
          transactionDate: new Date(dto.transferDate),
          transactionType: TransactionType.TRANSFER,
          reason: TransactionReason.WAREHOUSE_TRANSFER,
          itemId: item.itemId,
          warehouseId: dto.fromWarehouseId,
          locationId: dto.fromLocationId,
          toWarehouseId: dto.toWarehouseId,
          toLocationId: dto.toLocationId,
          batchNumber: item.batchNumber,
          serialNumber: item.serialNumber,
          quantity: item.quantity,
          unitCost: stockLevel.unitCost,
          totalValue: item.quantity * stockLevel.unitCost,
          remarks: item.remarks,
          createdBy: userId,
        })

        await queryRunner.manager.save(issueTransaction)
        transactions.push(issueTransaction)

        // Update source stock
        await this.updateStockLevel(
          queryRunner,
          item.itemId,
          dto.fromWarehouseId,
          dto.fromLocationId,
          item.batchNumber,
          item.serialNumber,
          -item.quantity,
          stockLevel.unitCost,
          stockItem.valuationMethod,
        )

        // Update destination stock
        await this.updateStockLevel(
          queryRunner,
          item.itemId,
          dto.toWarehouseId,
          dto.toLocationId,
          item.batchNumber,
          item.serialNumber,
          item.quantity,
          stockLevel.unitCost,
          stockItem.valuationMethod,
        )
      }

      await queryRunner.commitTransaction()
      return transactions
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  private async updateStockLevel(
    queryRunner: any,
    itemId: string,
    warehouseId: string,
    locationId: string | undefined,
    batchNumber: string | undefined,
    serialNumber: string | undefined,
    quantity: number,
    unitCost: number,
    valuationMethod: ValuationMethod,
  ) {
    let stockLevel = await this.getStockLevelRecord(
      queryRunner,
      itemId,
      warehouseId,
      locationId,
      batchNumber,
      serialNumber,
    )

    if (!stockLevel) {
      stockLevel = queryRunner.manager.create(StockLevel, {
        itemId,
        warehouseId,
        locationId,
        batchNumber,
        serialNumber,
        quantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
        unitCost: 0,
        totalValue: 0,
      })
    }

    const newQuantity = Number(stockLevel.quantity) + Number(quantity)
    const newUnitCost = this.calculateUnitCost(
      valuationMethod,
      Number(stockLevel.quantity),
      Number(stockLevel.unitCost),
      Number(quantity),
      Number(unitCost),
    )

    stockLevel.quantity = newQuantity
    stockLevel.unitCost = newUnitCost
    stockLevel.totalValue = newQuantity * newUnitCost
    stockLevel.availableQuantity = newQuantity - Number(stockLevel.reservedQuantity)

    await queryRunner.manager.save(stockLevel)
  }

  private calculateUnitCost(
    method: ValuationMethod,
    oldQty: number,
    oldCost: number,
    newQty: number,
    newCost: number,
  ): number {
    if (newQty < 0) {
      // Issue transaction - use existing cost
      return oldCost
    }

    switch (method) {
      case ValuationMethod.WEIGHTED_AVERAGE:
        const totalValue = oldQty * oldCost + newQty * newCost
        const totalQty = oldQty + newQty
        return totalQty > 0 ? totalValue / totalQty : newCost

      case ValuationMethod.FIFO:
      case ValuationMethod.LIFO:
        // Simplified - in production, maintain separate batch records
        return newCost

      case ValuationMethod.STANDARD_COST:
        return oldCost || newCost

      default:
        return newCost
    }
  }

  private async getStockLevelRecord(
    queryRunner: any,
    itemId: string,
    warehouseId: string,
    locationId: string | undefined,
    batchNumber: string | undefined,
    serialNumber: string | undefined,
  ): Promise<StockLevel | null> {
    const where: any = { itemId, warehouseId }

    if (locationId) where.locationId = locationId
    if (batchNumber) where.batchNumber = batchNumber
    if (serialNumber) where.serialNumber = serialNumber

    return queryRunner.manager.findOne(StockLevel, { where })
  }

  private async generateTransactionNumber(prefix: string): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    const lastTransaction = await this.stockTransactionRepository
      .createQueryBuilder("txn")
      .where("txn.transactionNumber LIKE :prefix", { prefix: `${prefix}${year}${month}%` })
      .orderBy("txn.transactionNumber", "DESC")
      .getOne()

    let sequence = 1
    if (lastTransaction) {
      const lastSeq = Number.parseInt(lastTransaction.transactionNumber.slice(-6))
      sequence = lastSeq + 1
    }

    return `${prefix}${year}${month}${sequence.toString().padStart(6, "0")}`
  }

  async getItemStockSummary(itemId: string) {
    const stockLevels = await this.stockLevelRepository.find({
      where: { itemId },
      relations: ["warehouse", "location"],
    })

    const totalQuantity = stockLevels.reduce((sum, level) => sum + Number(level.quantity), 0)
    const totalValue = stockLevels.reduce((sum, level) => sum + Number(level.totalValue), 0)
    const avgCost = totalQuantity > 0 ? totalValue / totalQuantity : 0

    return {
      itemId,
      totalQuantity,
      totalValue,
      averageCost: avgCost,
      warehouses: stockLevels.map((level) => ({
        warehouseId: level.warehouseId,
        warehouseName: level.warehouse.name,
        locationId: level.locationId,
        locationName: level.location?.name,
        batchNumber: level.batchNumber,
        serialNumber: level.serialNumber,
        quantity: level.quantity,
        availableQuantity: level.availableQuantity,
        unitCost: level.unitCost,
        totalValue: level.totalValue,
      })),
    }
  }
}

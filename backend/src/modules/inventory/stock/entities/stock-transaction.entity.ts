import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Item } from "../../items/entities/item.entity"
import { Warehouse } from "../../warehouses/entities/warehouse.entity"
import { Location } from "../../warehouses/entities/location.entity"

export enum TransactionType {
  RECEIPT = "receipt",
  ISSUE = "issue",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
  RETURN = "return",
  OPENING_STOCK = "opening_stock",
}

export enum TransactionReason {
  PURCHASE = "purchase",
  SALE = "sale",
  PRODUCTION = "production",
  DAMAGE = "damage",
  EXPIRY = "expiry",
  THEFT = "theft",
  STOCK_COUNT = "stock_count",
  CUSTOMER_RETURN = "customer_return",
  SUPPLIER_RETURN = "supplier_return",
  WAREHOUSE_TRANSFER = "warehouse_transfer",
  OTHER = "other",
}

@Entity("stock_transactions")
@Index(["item", "warehouse", "transactionDate"])
@Index(["referenceType", "referenceId"])
@Index(["transactionDate"])
export class StockTransaction extends BaseEntity {
  @Column()
  transactionNumber: string

  @Column({ type: "timestamp" })
  transactionDate: Date

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  transactionType: TransactionType

  @Column({
    type: "enum",
    enum: TransactionReason,
  })
  reason: TransactionReason

  @Column({ name: "item_id" })
  itemId: string

  @ManyToOne(
    () => Item,
    (item) => item.transactions,
  )
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ name: "warehouse_id" })
  warehouseId: string

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse

  @Column({ name: "location_id", nullable: true })
  locationId: string

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: "location_id" })
  location: Location

  @Column({ name: "to_warehouse_id", nullable: true })
  toWarehouseId: string

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: "to_warehouse_id" })
  toWarehouse: Warehouse

  @Column({ name: "to_location_id", nullable: true })
  toLocationId: string

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: "to_location_id" })
  toLocation: Location

  @Column({ nullable: true })
  batchNumber: string

  @Column({ nullable: true })
  serialNumber: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitCost: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  totalValue: number

  @Column({ nullable: true })
  referenceType: string

  @Column({ nullable: true })
  referenceId: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ name: "created_by" })
  createdBy: string
}

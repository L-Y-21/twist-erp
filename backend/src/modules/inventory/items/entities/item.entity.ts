import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Category } from "../../categories/entities/category.entity"
import { Unit } from "../../units/entities/unit.entity"
import { StockLevel } from "../../stock/entities/stock-level.entity"
import { StockTransaction } from "../../stock/entities/stock-transaction.entity"

export enum ItemType {
  RAW_MATERIAL = "raw_material",
  FINISHED_GOODS = "finished_goods",
  SEMI_FINISHED = "semi_finished",
  CONSUMABLE = "consumable",
  SERVICE = "service",
  ASSET = "asset",
}

export enum ValuationMethod {
  FIFO = "fifo",
  LIFO = "lifo",
  WEIGHTED_AVERAGE = "weighted_average",
  STANDARD_COST = "standard_cost",
}

@Entity("items")
@Index(["code"], { unique: true })
@Index(["type", "categoryId"])
export class Item extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({
    type: "enum",
    enum: ItemType,
    default: ItemType.RAW_MATERIAL,
  })
  type: ItemType

  @Column({ name: "category_id" })
  categoryId: string

  @ManyToOne(
    () => Category,
    (category) => category.items,
  )
  @JoinColumn({ name: "category_id" })
  category: Category

  @Column({ name: "unit_id" })
  unitId: string

  @ManyToOne(() => Unit)
  @JoinColumn({ name: "unit_id" })
  unit: Unit

  @Column({
    type: "enum",
    enum: ValuationMethod,
    default: ValuationMethod.WEIGHTED_AVERAGE,
  })
  valuationMethod: ValuationMethod

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  standardCost: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  sellingPrice: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  reorderLevel: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  reorderQuantity: number

  @Column({ default: false })
  isBatchTracked: boolean

  @Column({ default: false })
  isSerialTracked: boolean

  @Column({ default: false })
  hasExpiryDate: boolean

  @Column({ nullable: true })
  hsnCode: string

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  taxRate: number

  @Column({ nullable: true })
  barcode: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => StockLevel,
    (stockLevel) => stockLevel.item,
  )
  stockLevels: StockLevel[]

  @OneToMany(
    () => StockTransaction,
    (transaction) => transaction.item,
  )
  transactions: StockTransaction[]
}

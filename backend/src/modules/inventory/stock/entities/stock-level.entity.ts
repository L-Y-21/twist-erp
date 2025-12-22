import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Item } from "../../items/entities/item.entity"
import { Warehouse } from "../../warehouses/entities/warehouse.entity"
import { Location } from "../../warehouses/entities/location.entity"

@Entity("stock_levels")
@Unique(["item", "warehouse", "location", "batchNumber", "serialNumber"])
@Index(["item", "warehouse"])
@Index(["batchNumber"])
@Index(["serialNumber"])
export class StockLevel extends BaseEntity {
  @Column({ name: "item_id" })
  itemId: string

  @ManyToOne(
    () => Item,
    (item) => item.stockLevels,
  )
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ name: "warehouse_id" })
  warehouseId: string

  @ManyToOne(
    () => Warehouse,
    (warehouse) => warehouse.stockLevels,
  )
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse

  @Column({ name: "location_id", nullable: true })
  locationId: string

  @ManyToOne(
    () => Location,
    (location) => location.stockLevels,
    { nullable: true },
  )
  @JoinColumn({ name: "location_id" })
  location: Location

  @Column({ nullable: true })
  batchNumber: string

  @Column({ nullable: true })
  serialNumber: string

  @Column({ type: "date", nullable: true })
  manufacturingDate: Date

  @Column({ type: "date", nullable: true })
  expiryDate: Date

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  reservedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  availableQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  unitCost: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalValue: number
}

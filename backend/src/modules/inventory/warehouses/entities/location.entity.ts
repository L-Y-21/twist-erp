import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Warehouse } from "./warehouse.entity"
import { StockLevel } from "../../stock/entities/stock-level.entity"

@Entity("locations")
@Index(["warehouse", "code"], { unique: true })
export class Location extends BaseEntity {
  @Column()
  code: string

  @Column()
  name: string

  @Column({ name: "warehouse_id" })
  warehouseId: string

  @ManyToOne(
    () => Warehouse,
    (warehouse) => warehouse.locations,
  )
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse

  @Column({ nullable: true })
  aisle: string

  @Column({ nullable: true })
  rack: string

  @Column({ nullable: true })
  shelf: string

  @Column({ nullable: true })
  bin: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => StockLevel,
    (stockLevel) => stockLevel.location,
  )
  stockLevels: StockLevel[]
}

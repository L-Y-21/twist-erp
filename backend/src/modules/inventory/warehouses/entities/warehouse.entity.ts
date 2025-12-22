import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Location } from "./location.entity"
import { StockLevel } from "../../stock/entities/stock-level.entity"

export enum WarehouseType {
  MAIN = "main",
  BRANCH = "branch",
  TRANSIT = "transit",
  SITE = "site",
}

@Entity("warehouses")
@Index(["code"], { unique: true })
export class Warehouse extends BaseEntity {
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: WarehouseType,
    default: WarehouseType.BRANCH,
  })
  type: WarehouseType

  @Column({ type: "text", nullable: true })
  address: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  pincode: string

  @Column({ nullable: true })
  contactPerson: string

  @Column({ nullable: true })
  contactPhone: string

  @Column({ nullable: true })
  contactEmail: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Location,
    (location) => location.warehouse,
  )
  locations: Location[]

  @OneToMany(
    () => StockLevel,
    (stockLevel) => stockLevel.warehouse,
  )
  stockLevels: StockLevel[]
}

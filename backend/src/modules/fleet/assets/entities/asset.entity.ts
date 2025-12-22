import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { AssetMaintenance } from "./asset-maintenance.entity"

export enum AssetType {
  MACHINERY = "machinery",
  EQUIPMENT = "equipment",
  FURNITURE = "furniture",
  IT_EQUIPMENT = "it_equipment",
  TOOLS = "tools",
  OTHER = "other",
}

export enum AssetStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  OUT_OF_SERVICE = "out_of_service",
  DISPOSED = "disposed",
}

@Entity("assets")
@Index(["assetCode"], { unique: true })
@Index(["status", "type"])
export class Asset extends BaseEntity {
  @Column({ unique: true })
  assetCode: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: AssetType,
  })
  type: AssetType

  @Column({ nullable: true })
  make: string

  @Column({ nullable: true })
  model: string

  @Column({ nullable: true })
  serialNumber: string

  @Column({ type: "date", nullable: true })
  purchaseDate: Date

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  purchasePrice: number

  @Column({ nullable: true })
  vendorId: string

  @Column({ nullable: true })
  warrantyExpiryDate: Date

  @Column({
    type: "enum",
    enum: AssetStatus,
    default: AssetStatus.AVAILABLE,
  })
  status: AssetStatus

  @Column({ nullable: true })
  currentLocation: string

  @Column({ nullable: true })
  assignedTo: string

  @Column({ nullable: true })
  projectId: string

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  currentValue: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  depreciationRate: number

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => AssetMaintenance,
    (maintenance) => maintenance.asset,
  )
  maintenanceRecords: AssetMaintenance[]
}

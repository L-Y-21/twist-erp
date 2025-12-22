import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Asset } from "./asset.entity"

export enum AssetMaintenanceType {
  SCHEDULED = "scheduled",
  BREAKDOWN = "breakdown",
  PREVENTIVE = "preventive",
  REPAIR = "repair",
  CALIBRATION = "calibration",
}

export enum AssetMaintenanceStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("asset_maintenance")
@Index(["asset", "maintenanceDate"])
export class AssetMaintenance extends BaseEntity {
  @Column({ name: "asset_id" })
  assetId: string

  @ManyToOne(
    () => Asset,
    (asset) => asset.maintenanceRecords,
  )
  @JoinColumn({ name: "asset_id" })
  asset: Asset

  @Column({ type: "date" })
  maintenanceDate: Date

  @Column({
    type: "enum",
    enum: AssetMaintenanceType,
  })
  type: AssetMaintenanceType

  @Column({
    type: "enum",
    enum: AssetMaintenanceStatus,
    default: AssetMaintenanceStatus.SCHEDULED,
  })
  status: AssetMaintenanceStatus

  @Column({ type: "text" })
  description: string

  @Column({ type: "text", nullable: true })
  workDone: string

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  cost: number

  @Column({ nullable: true })
  performedBy: string

  @Column({ nullable: true })
  vendorId: string

  @Column({ type: "date", nullable: true })
  nextMaintenanceDate: Date

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ name: "created_by" })
  createdBy: string
}

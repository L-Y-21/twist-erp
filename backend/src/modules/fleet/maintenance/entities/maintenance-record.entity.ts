import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Vehicle } from "../../vehicles/entities/vehicle.entity"

export enum MaintenanceType {
  SCHEDULED = "scheduled",
  BREAKDOWN = "breakdown",
  PREVENTIVE = "preventive",
  CORRECTIVE = "corrective",
  INSPECTION = "inspection",
}

export enum MaintenanceStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("maintenance_records")
@Index(["vehicle", "maintenanceDate"])
@Index(["status", "type"])
export class MaintenanceRecord extends BaseEntity {
  @Column({ name: "vehicle_id" })
  vehicleId: string

  @ManyToOne(
    () => Vehicle,
    (vehicle) => vehicle.maintenanceRecords,
  )
  @JoinColumn({ name: "vehicle_id" })
  vehicle: Vehicle

  @Column()
  workOrderNumber: string

  @Column({ type: "date" })
  maintenanceDate: Date

  @Column({
    type: "enum",
    enum: MaintenanceType,
  })
  type: MaintenanceType

  @Column({
    type: "enum",
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus

  @Column({ type: "text" })
  description: string

  @Column({ type: "text", nullable: true })
  workDone: string

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  laborCost: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  partsCost: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalCost: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  odometerReading: number

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  hourMeterReading: number

  @Column({ nullable: true })
  mechanicName: string

  @Column({ nullable: true })
  workshopName: string

  @Column({ nullable: true })
  vendorId: string

  @Column({ nullable: true })
  invoiceNumber: string

  @Column({ type: "date", nullable: true })
  nextMaintenanceDate: Date

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  nextMaintenanceOdometer: number

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ name: "created_by" })
  createdBy: string
}

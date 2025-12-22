import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Vehicle } from "../../vehicles/entities/vehicle.entity"
import { Driver } from "../../drivers/entities/driver.entity"

export enum AssignmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("vehicle_assignments")
@Index(["vehicle", "status"])
@Index(["driver", "status"])
export class VehicleAssignment extends BaseEntity {
  @Column({ name: "vehicle_id" })
  vehicleId: string

  @ManyToOne(
    () => Vehicle,
    (vehicle) => vehicle.assignments,
  )
  @JoinColumn({ name: "vehicle_id" })
  vehicle: Vehicle

  @Column({ name: "driver_id" })
  driverId: string

  @ManyToOne(
    () => Driver,
    (driver) => driver.assignments,
  )
  @JoinColumn({ name: "driver_id" })
  driver: Driver

  @Column({ nullable: true })
  projectId: string

  @Column({ type: "date" })
  startDate: Date

  @Column({ type: "date", nullable: true })
  endDate: Date

  @Column({
    type: "enum",
    enum: AssignmentStatus,
    default: AssignmentStatus.ACTIVE,
  })
  status: AssignmentStatus

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  startOdometer: number

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  endOdometer: number

  @Column({ type: "text", nullable: true })
  purpose: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ name: "assigned_by" })
  assignedBy: string
}

import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Vehicle } from "../../vehicles/entities/vehicle.entity"

export enum FuelType {
  PETROL = "petrol",
  DIESEL = "diesel",
  CNG = "cng",
  ELECTRIC = "electric",
}

@Entity("fuel_entries")
@Index(["vehicle", "fuelDate"])
export class FuelEntry extends BaseEntity {
  @Column({ name: "vehicle_id" })
  vehicleId: string

  @ManyToOne(
    () => Vehicle,
    (vehicle) => vehicle.fuelEntries,
  )
  @JoinColumn({ name: "vehicle_id" })
  vehicle: Vehicle

  @Column({ type: "date" })
  fuelDate: Date

  @Column({
    type: "enum",
    enum: FuelType,
  })
  fuelType: FuelType

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerUnit: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalCost: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  odometer: number

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  hourMeter: number

  @Column({ nullable: true })
  vendorName: string

  @Column({ nullable: true })
  invoiceNumber: string

  @Column({ nullable: true })
  driverId: string

  @Column({ nullable: true })
  projectId: string

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  fuelEfficiency: number

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ name: "created_by" })
  createdBy: string
}

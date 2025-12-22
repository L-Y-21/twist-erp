import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { FuelEntry } from "../../fuel/entities/fuel-entry.entity"
import { MaintenanceRecord } from "../../maintenance/entities/maintenance-record.entity"
import { VehicleAssignment } from "../../assignments/entities/vehicle-assignment.entity"

export enum VehicleType {
  CAR = "car",
  TRUCK = "truck",
  VAN = "van",
  EXCAVATOR = "excavator",
  CRANE = "crane",
  CONCRETE_MIXER = "concrete_mixer",
  LOADER = "loader",
  BULLDOZER = "bulldozer",
  GENERATOR = "generator",
  OTHER = "other",
}

export enum VehicleStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  OUT_OF_SERVICE = "out_of_service",
  DISPOSED = "disposed",
}

export enum OwnershipType {
  OWNED = "owned",
  LEASED = "leased",
  RENTED = "rented",
}

@Entity("vehicles")
@Index(["vehicleNumber"], { unique: true })
@Index(["status", "type"])
export class Vehicle extends BaseEntity {
  @Column({ unique: true })
  vehicleNumber: string

  @Column()
  registrationNumber: string

  @Column({
    type: "enum",
    enum: VehicleType,
  })
  type: VehicleType

  @Column({ nullable: true })
  make: string

  @Column({ nullable: true })
  model: string

  @Column({ nullable: true })
  year: number

  @Column({
    type: "enum",
    enum: OwnershipType,
    default: OwnershipType.OWNED,
  })
  ownershipType: OwnershipType

  @Column({ type: "date", nullable: true })
  purchaseDate: Date

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  purchasePrice: number

  @Column({ nullable: true })
  chassisNumber: string

  @Column({ nullable: true })
  engineNumber: string

  @Column({ nullable: true })
  fuelType: string

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  fuelCapacity: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  currentOdometer: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  currentHourMeter: number

  @Column({ type: "date", nullable: true })
  insuranceExpiryDate: Date

  @Column({ nullable: true })
  insurancePolicyNumber: string

  @Column({ nullable: true })
  insuranceProvider: string

  @Column({ type: "date", nullable: true })
  fitnessExpiryDate: Date

  @Column({ type: "date", nullable: true })
  permitExpiryDate: Date

  @Column({ type: "date", nullable: true })
  pollutionExpiryDate: Date

  @Column({
    type: "enum",
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus

  @Column({ nullable: true })
  currentDriverId: string

  @Column({ nullable: true })
  currentProjectId: string

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => FuelEntry,
    (entry) => entry.vehicle,
  )
  fuelEntries: FuelEntry[]

  @OneToMany(
    () => MaintenanceRecord,
    (record) => record.vehicle,
  )
  maintenanceRecords: MaintenanceRecord[]

  @OneToMany(
    () => VehicleAssignment,
    (assignment) => assignment.vehicle,
  )
  assignments: VehicleAssignment[]
}

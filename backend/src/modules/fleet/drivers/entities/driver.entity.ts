import { Entity, Column, OneToMany, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { VehicleAssignment } from "../../assignments/entities/vehicle-assignment.entity"

export enum DriverStatus {
  ACTIVE = "active",
  ON_LEAVE = "on_leave",
  SUSPENDED = "suspended",
  TERMINATED = "terminated",
}

@Entity("drivers")
@Index(["employeeCode"], { unique: true })
export class Driver extends BaseEntity {
  @Column({ unique: true })
  employeeCode: string

  @Column()
  name: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  pincode: string

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date

  @Column({ type: "date" })
  joiningDate: Date

  @Column()
  licenseNumber: string

  @Column({ type: "date" })
  licenseExpiryDate: Date

  @Column({ nullable: true })
  licenseType: string

  @Column({ nullable: true })
  bloodGroup: string

  @Column({ nullable: true })
  emergencyContactName: string

  @Column({ nullable: true })
  emergencyContactPhone: string

  @Column({
    type: "enum",
    enum: DriverStatus,
    default: DriverStatus.ACTIVE,
  })
  status: DriverStatus

  @Column({ type: "text", nullable: true })
  notes: string

  @OneToMany(
    () => VehicleAssignment,
    (assignment) => assignment.driver,
  )
  assignments: VehicleAssignment[]
}

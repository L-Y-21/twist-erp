import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Attendance } from "../../attendance/entities/attendance.entity"
import { Leave } from "../../leave/entities/leave.entity"
import { Payroll } from "../../payroll/entities/payroll.entity"

export enum EmployeeStatus {
  ACTIVE = "active",
  ON_LEAVE = "on_leave",
  SUSPENDED = "suspended",
  RESIGNED = "resigned",
  TERMINATED = "terminated",
}

export enum EmploymentType {
  PERMANENT = "permanent",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
  INTERN = "intern",
}

@Entity("employees")
@Index(["employeeCode"], { unique: true })
@Index(["status", "departmentId"])
export class Employee extends BaseEntity {
  @Column({ unique: true })
  employeeCode: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  mobile: string

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date

  @Column({ nullable: true })
  gender: string

  @Column({ nullable: true })
  maritalStatus: string

  @Column({ type: "text", nullable: true })
  address: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  pincode: string

  @Column({ nullable: true })
  nationality: string

  @Column({ nullable: true })
  bloodGroup: string

  @Column({ type: "date" })
  joiningDate: Date

  @Column({ type: "date", nullable: true })
  confirmationDate: Date

  @Column({ type: "date", nullable: true })
  resignationDate: Date

  @Column({ type: "date", nullable: true })
  lastWorkingDay: Date

  @Column({
    type: "enum",
    enum: EmploymentType,
    default: EmploymentType.PERMANENT,
  })
  employmentType: EmploymentType

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus

  @Column({ nullable: true })
  departmentId: string

  @Column({ nullable: true })
  designationId: string

  @Column({ nullable: true })
  reportingManagerId: string

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: "reportingManagerId" })
  reportingManager: Employee

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  basicSalary: number

  @Column({ nullable: true })
  bankName: string

  @Column({ nullable: true })
  accountNumber: string

  @Column({ nullable: true })
  ifscCode: string

  @Column({ nullable: true })
  panNumber: string

  @Column({ nullable: true })
  aadharNumber: string

  @Column({ nullable: true })
  pfNumber: string

  @Column({ nullable: true })
  esiNumber: string

  @Column({ nullable: true })
  emergencyContactName: string

  @Column({ nullable: true })
  emergencyContactPhone: string

  @Column({ type: "text", nullable: true })
  notes: string

  @OneToMany(
    () => Attendance,
    (attendance) => attendance.employee,
  )
  attendances: Attendance[]

  @OneToMany(
    () => Leave,
    (leave) => leave.employee,
  )
  leaves: Leave[]

  @OneToMany(
    () => Payroll,
    (payroll) => payroll.employee,
  )
  payrolls: Payroll[]
}

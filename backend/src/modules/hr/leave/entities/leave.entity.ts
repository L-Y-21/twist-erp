import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Employee } from "../../employees/entities/employee.entity"

export enum LeaveType {
  CASUAL = "casual",
  SICK = "sick",
  EARNED = "earned",
  MATERNITY = "maternity",
  PATERNITY = "paternity",
  UNPAID = "unpaid",
  COMPENSATORY = "compensatory",
}

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

@Entity("leaves")
@Index(["employeeId", "fromDate", "toDate"])
@Index(["status", "leaveType"])
export class Leave extends BaseEntity {
  @Column({ name: "employee_id" })
  employeeId: string

  @ManyToOne(
    () => Employee,
    (employee) => employee.leaves,
  )
  @JoinColumn({ name: "employee_id" })
  employee: Employee

  @Column({
    type: "enum",
    enum: LeaveType,
  })
  leaveType: LeaveType

  @Column({ type: "date" })
  fromDate: Date

  @Column({ type: "date" })
  toDate: Date

  @Column({ type: "decimal", precision: 5, scale: 2 })
  numberOfDays: number

  @Column({ type: "text" })
  reason: string

  @Column({
    type: "enum",
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @Column({ type: "text", nullable: true })
  rejectionReason: string

  @Column({ type: "text", nullable: true })
  remarks: string
}

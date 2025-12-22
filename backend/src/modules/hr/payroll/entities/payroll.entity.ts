import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index, Unique } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Employee } from "../../employees/entities/employee.entity"
import { PayrollComponent } from "./payroll-component.entity"

export enum PayrollStatus {
  DRAFT = "draft",
  PROCESSED = "processed",
  APPROVED = "approved",
  PAID = "paid",
  CANCELLED = "cancelled",
}

@Entity("payrolls")
@Unique(["employeeId", "month", "year"])
@Index(["employeeId", "year", "month"])
@Index(["status", "paymentDate"])
export class Payroll extends BaseEntity {
  @Column({ name: "employee_id" })
  employeeId: string

  @ManyToOne(
    () => Employee,
    (employee) => employee.payrolls,
  )
  @JoinColumn({ name: "employee_id" })
  employee: Employee

  @Column()
  month: number

  @Column()
  year: number

  @Column({ type: "date" })
  payPeriodStart: Date

  @Column({ type: "date" })
  payPeriodEnd: Date

  @Column({ type: "int", default: 0 })
  workingDays: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  presentDays: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  absentDays: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  leaveDays: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  paidDays: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  basicSalary: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalEarnings: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalDeductions: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  grossSalary: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  netSalary: number

  @Column({
    type: "enum",
    enum: PayrollStatus,
    default: PayrollStatus.DRAFT,
  })
  status: PayrollStatus

  @Column({ type: "date", nullable: true })
  paymentDate: Date

  @Column({ nullable: true })
  paymentMethod: string

  @Column({ nullable: true })
  paymentReference: string

  @Column({ nullable: true })
  processedBy: string

  @Column({ type: "timestamp", nullable: true })
  processedDate: Date

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @Column({ type: "text", nullable: true })
  remarks: string

  @OneToMany(
    () => PayrollComponent,
    (component) => component.payroll,
    { cascade: true },
  )
  components: PayrollComponent[]
}

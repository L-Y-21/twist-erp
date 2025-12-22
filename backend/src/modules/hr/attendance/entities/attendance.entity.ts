import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Employee } from "../../employees/entities/employee.entity"

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  HALF_DAY = "half_day",
  LATE = "late",
  ON_LEAVE = "on_leave",
  HOLIDAY = "holiday",
  WEEK_OFF = "week_off",
}

@Entity("attendance")
@Unique(["employeeId", "date"])
@Index(["employeeId", "date"])
@Index(["date", "status"])
export class Attendance extends BaseEntity {
  @Column({ name: "employee_id" })
  employeeId: string

  @ManyToOne(
    () => Employee,
    (employee) => employee.attendances,
  )
  @JoinColumn({ name: "employee_id" })
  employee: Employee

  @Column({ type: "date" })
  date: Date

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus

  @Column({ type: "time", nullable: true })
  checkIn: string

  @Column({ type: "time", nullable: true })
  checkOut: string

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  workHours: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  overtimeHours: number

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date
}

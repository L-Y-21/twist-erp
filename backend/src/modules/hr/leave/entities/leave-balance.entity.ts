import { Entity, Column, Index, Unique } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { LeaveType } from "./leave.entity"

@Entity("leave_balances")
@Unique(["employeeId", "year", "leaveType"])
@Index(["employeeId", "year"])
export class LeaveBalance extends BaseEntity {
  @Column()
  employeeId: string

  @Column()
  year: number

  @Column({
    type: "enum",
    enum: LeaveType,
  })
  leaveType: LeaveType

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  totalLeaves: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  usedLeaves: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  pendingLeaves: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  availableLeaves: number
}

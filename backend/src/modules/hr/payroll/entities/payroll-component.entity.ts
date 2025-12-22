import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Payroll } from "./payroll.entity"

export enum ComponentType {
  EARNING = "earning",
  DEDUCTION = "deduction",
}

@Entity("payroll_components")
export class PayrollComponent extends BaseEntity {
  @Column({ name: "payroll_id" })
  payrollId: string

  @ManyToOne(
    () => Payroll,
    (payroll) => payroll.components,
  )
  @JoinColumn({ name: "payroll_id" })
  payroll: Payroll

  @Column()
  componentCode: string

  @Column()
  componentName: string

  @Column({
    type: "enum",
    enum: ComponentType,
  })
  type: ComponentType

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number

  @Column({ type: "text", nullable: true })
  remarks: string
}

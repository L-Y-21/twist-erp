import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { ProgressBilling } from "./progress-billing.entity"
import { BOQItem } from "../../boq/entities/boq-item.entity"

@Entity("progress_billing_items")
export class ProgressBillingItem extends BaseEntity {
  @Column({ name: "progress_billing_id" })
  progressBillingId: string

  @ManyToOne(
    () => ProgressBilling,
    (billing) => billing.items,
  )
  @JoinColumn({ name: "progress_billing_id" })
  progressBilling: ProgressBilling

  @Column({ name: "boq_item_id" })
  boqItemId: string

  @ManyToOne(() => BOQItem)
  @JoinColumn({ name: "boq_item_id" })
  boqItem: BOQItem

  @Column({ type: "text" })
  description: string

  @Column()
  unit: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  boqQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  previousQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4 })
  currentQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4 })
  cumulativeQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitRate: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  previousAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  currentAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  cumulativeAmount: number

  @Column({ type: "text", nullable: true })
  remarks: string
}

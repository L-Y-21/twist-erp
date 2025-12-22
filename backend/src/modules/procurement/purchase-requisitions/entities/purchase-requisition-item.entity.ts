import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { PurchaseRequisition } from "./purchase-requisition.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("purchase_requisition_items")
export class PurchaseRequisitionItem extends BaseEntity {
  @Column({ name: "requisition_id" })
  requisitionId: string

  @ManyToOne(
    () => PurchaseRequisition,
    (pr) => pr.items,
  )
  @JoinColumn({ name: "requisition_id" })
  requisition: PurchaseRequisition

  @Column({ name: "item_id" })
  itemId: string

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  orderedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  estimatedUnitPrice: number

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  estimatedAmount: number

  @Column({ type: "text", nullable: true })
  specifications: string

  @Column({ type: "text", nullable: true })
  remarks: string
}

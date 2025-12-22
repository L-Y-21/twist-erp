import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { PurchaseOrder } from "./purchase-order.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("purchase_order_items")
export class PurchaseOrderItem extends BaseEntity {
  @Column({ name: "purchase_order_id" })
  purchaseOrderId: string

  @ManyToOne(
    () => PurchaseOrder,
    (po) => po.items,
  )
  @JoinColumn({ name: "purchase_order_id" })
  purchaseOrder: PurchaseOrder

  @Column({ name: "item_id" })
  itemId: string

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  orderedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  receivedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitPrice: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  taxRate: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  totalAmount: number

  @Column({ nullable: true })
  hsnCode: string

  @Column({ type: "text", nullable: true })
  specifications: string

  @Column({ type: "text", nullable: true })
  remarks: string
}

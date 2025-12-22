import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { SalesOrder } from "./sales-order.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("sales_order_items")
export class SalesOrderItem extends BaseEntity {
  @Column({ name: "sales_order_id" })
  salesOrderId: string

  @ManyToOne(
    () => SalesOrder,
    (order) => order.items,
  )
  @JoinColumn({ name: "sales_order_id" })
  salesOrder: SalesOrder

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
  deliveredQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  invoicedQuantity: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  unitPrice: number

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  taxRate: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: "decimal", precision: 18, scale: 2 })
  totalAmount: number

  @Column({ nullable: true })
  warehouseId: string

  @Column({ type: "text", nullable: true })
  specifications: string
}

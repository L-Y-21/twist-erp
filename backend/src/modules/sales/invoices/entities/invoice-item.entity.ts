import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "../../../../common/entities/base.entity"
import { Invoice } from "./invoice.entity"
import { Item } from "../../../inventory/items/entities/item.entity"

@Entity("invoice_items")
export class InvoiceItem extends BaseEntity {
  @Column({ name: "invoice_id" })
  invoiceId: string

  @ManyToOne(
    () => Invoice,
    (invoice) => invoice.items,
  )
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice

  @Column({ name: "item_id", nullable: true })
  itemId: string

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: "item_id" })
  item: Item

  @Column({ type: "text" })
  description: string

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number

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
}
